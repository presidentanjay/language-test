const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

const serialize = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true },
            orderBy: { created_at: "desc" }
        });
        res.json(serialize(users));
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: BigInt(req.params.id) },
            include: { profile: true }
        });
        res.json(serialize(user));
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: BigInt(req.params.id) } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.patch('/:id', async (req, res) => {
    const { name, npm, picture } = req.body;
    try {
        const updateData = { name };
        if (picture) updateData.picture = picture;

        await prisma.user.update({
            where: { id: BigInt(req.params.id) },
            data: {
                ...updateData,
                profile: { update: { npm } }
            }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
