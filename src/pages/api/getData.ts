import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const groups = await prisma.group.findMany({
        include: {
          rounds: true,
        },
      })
      res.status(200).json(groups)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}