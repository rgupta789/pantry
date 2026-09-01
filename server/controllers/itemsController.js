const db = require('../db');

async function addItem(req, res) {
    
    const { name, amount, loc } = req.body;

    if (!name || !amount || !loc) {
        return res.status(400).json({ error: 'name, amount and location are required'})

    }

    try {
        const newItem = await db.one(
            `INSERT INTO inventory_items (name, amount, location)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, amount, loc]
        );
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item: ', error);
        res.status(500).json({ error: 'Failed to add item '});
    }
}


module.exports = {
    addItem
}