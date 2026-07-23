import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create skill (owner only)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const skill = await prisma.skill.create({ data });
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update skill (owner only)
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data
    });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete skill (owner only)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;
