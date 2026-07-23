import { verifyToken } from '../lib/jwt.js';
import prisma from '../lib/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const owner = await prisma.owner.findUnique({
      where: { id: decoded.id }
    });

    if (!owner) {
      return res.status(401).json({ error: 'Unauthorized: Owner not found' });
    }

    req.owner = { id: owner.id, email: owner.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
