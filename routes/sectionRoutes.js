const express = require('express');
const router = express.Router();
const { Section } = require('../models');
const {authMiddleware} = require('../middleware/authMiddleware');

// Create new section
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    const exists = await Section.findOne({ where: { name } });
    if (exists) return res.status(400).json({ success: false, message: 'Section already exists.' });

    const section = await Section.create({ name });
    res.status(201).json({ success: true, section });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all sections (optional)
router.get('/', authMiddleware, async (req, res) => {
  const sections = await Section.findAll({ order: [['id', 'ASC']] });
  res.json({ success: true, sections });
});

module.exports = router;
