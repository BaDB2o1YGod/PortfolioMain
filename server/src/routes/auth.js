import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/db.js';
import { signToken } from '../lib/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const owner = await prisma.owner.findUnique({
      where: { email }
    });

    if (!owner) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: owner.id, email: owner.email });

    res.json({
      message: 'Login successful',
      token,
      owner: { id: owner.id, email: owner.email, name: owner.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const owner = await prisma.owner.findUnique({
      where: { id: req.owner.id }
    });

    const isMatch = await bcrypt.compare(currentPassword, owner.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.owner.update({
      where: { id: req.owner.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
