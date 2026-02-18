const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

const serialize = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

// Logic for question CRUD would go here, omitting for brevity of migration step
// but basically mirror the app/actions/question.ts logic

router.get('/section/:sectionId', async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            where: { section_id: BigInt(req.params.sectionId) },
            include: { answers: true },
            orderBy: { ordering: 'asc' }
        });
        res.json(serialize(questions));
    } catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
