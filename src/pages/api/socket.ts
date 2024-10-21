import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SocketHandler = (req:any, res:any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('updatePoints', async ({ groupId, roundNumber, points }) => {
        try {
          const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
              rounds: {
                upsert: {
                  where: {
                    id: `${groupId}-${roundNumber}`,
                  },
                  create: {
                    number: roundNumber,
                    points: points,
                  },
                  update: {
                    points: points,
                  },
                },
              },
            },
            include: {
              rounds: true,
            },
          })

          const allGroups = await prisma.group.findMany({
            include: {
              rounds: true,
            },
          })

          io.emit('pointsUpdated', allGroups)
        } catch (error) {
          console.error('Error updating points:', error)
        }
      })
    })
  }
  res.end()
}

export default SocketHandler