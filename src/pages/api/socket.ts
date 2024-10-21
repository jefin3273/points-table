import { Server as SocketIOServer } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { Server as NetServer } from 'http'

const prisma = new PrismaClient()

export type NextApiResponseServerIO = {
  end(): unknown
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server as any)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('New client connected')

      socket.on('updatePoints', async ({ groupNumber, roundNumber, points }) => {
        console.log('Updating points:', { groupNumber, roundNumber, points })
        try {
          const group = await prisma.group.findUnique({
            where: { groupNumber: parseInt(groupNumber) },
          })

          if (!group) {
            throw new Error('Group not found')
          }

          await prisma.round.upsert({
            where: {
              groupId_number: {
                groupId: group.id,
                number: roundNumber,
              },
            },
            update: {
              points: points,
            },
            create: {
              groupId: group.id,
              number: roundNumber,
              points: points,
            },
          })

          const allGroups = await prisma.group.findMany({
            include: {
              rounds: true,
            },
          })

          console.log('Emitting updated groups')
          io.emit('pointsUpdated', allGroups)
        } catch (error) {
          console.error('Error updating points:', error)
          socket.emit('error', { message: error instanceof Error ? error.message : 'An unknown error occurred' })
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  res.end()
}

export default SocketHandler