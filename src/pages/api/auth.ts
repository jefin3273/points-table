import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body

    try {
      const user = await prisma.user.findUnique({ where: { username } })

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

      res.status(200).json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}