import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();

// Get all experiences (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' }
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create experience (owner only)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // ensure date fields are parsed
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const experience = await prisma.experience.create({ data });
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update experience (owner only)
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data
    });
    res.json(experience);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete experience (owner only)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;
