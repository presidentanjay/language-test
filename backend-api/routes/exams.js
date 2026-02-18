const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// Helper to handle BigInt serialization
const serialize = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ));
}

// Get all exams
router.get('/', async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(serialize(exams));
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
});

// Get single exam by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const examId = BigInt(id);
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: {
                sections: {
                    include: {
                        questions: {
                            include: {
                                answers: true
                            },
                            orderBy: { ordering: 'asc' }
                        }
                    },
                    orderBy: { id: 'asc' }
                }
            }
        });
        res.json(serialize(exam));
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch exam' });
    }
});

// Create exam
router.post('/', async (req, res) => {
    const { code, title, category } = req.body;
    try {
        const exam = await prisma.exam.create({
            data: {
                code,
                title,
                category,
                status: 'progress',
                activated: 'no'
            }
        });
        res.json(serialize(exam));
    } catch (e) {
        res.status(500).json({ error: 'Failed to create exam' });
    }
});

// Delete exam
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.exam.delete({
            where: { id: BigInt(id) }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete exam' });
    }
});

// Toggle activation
router.patch('/:id/activation', async (req, res) => {
    const { id } = req.params;
    const { activated } = req.body;
    try {
        await prisma.exam.update({
            where: { id: BigInt(id) },
            data: { activated: activated ? 'yes' : 'no' }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to toggle activation' });
    }
});

module.exports = router;
