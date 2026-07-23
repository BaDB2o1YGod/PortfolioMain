import { Router } from 'express';
import prisma from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { featured, category } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;
    if (category) filter.category = category;

    const projects = await prisma.project.findMany({
      where: filter,
      orderBy: { startedAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (owner only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update project (owner only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete project (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;
