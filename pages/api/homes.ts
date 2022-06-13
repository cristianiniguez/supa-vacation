import { NextApiHandler } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { image, title, description, price, guests, beds, baths } = req.body;
      const home = await prisma.home.create({
        data: { image, title, description, price, guests, beds, baths },
      });
      res.status(200).json(home);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
