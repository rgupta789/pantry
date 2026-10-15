const db = require('../db');

async function addItem(req, res) {
    // currently adds everything as sep entry to db
    // e.g. adding 1 orange twice is 2 sep entries of 1 orange
    // should be consolidated into 1 entry of 2 oranges
    
    const { name, amount, unit, loc } = req.body;

    if (!name || !amount || !loc) {
        return res.status(400).json({ error: 'name, amount and location are required'})

    }

    try {
        const newItem = await db.one(
            `INSERT INTO inventory_items (name, amount, unit, location)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (name, location)
            DO UPDATE SET amount = inventory_items.amount + EXCLUDED.amount
            RETURNING *`,
            [name, amount, unit, loc]
        );
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item: ', error);
        res.status(500).json({ error: 'Failed to add item '});
    }
}

async function getItems(req, res) {
    try {
        console.log("reached getitems");
        const result = await db.query('Select * FROM inventory_items');

        console.log(result);
        res.json(result);

    } catch (error) {
        console.error('Error getting items: ', error);
        res.status(500).json({ error: 'Error getting items'});
    }
}


module.exports = {
    addItem,
    getItems
}