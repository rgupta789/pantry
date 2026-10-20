const db = require('../db');

async function addItem(req, res) {
    
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


async function deleteItem(req, res) {
    // add error handling
    // console.log('param id:', JSON.stringify(req.params.id), typeof req.params.id);
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM inventory_items WHERE id = $1 RETURNING id', [id]);
        console.log(result);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting item: ", error);
    }
}


async function getItems(req, res) {
    try {
        const result = await db.query('Select * FROM inventory_items');
        // console.log(result);
        res.json(result);

    } catch (error) {
        console.error('Error getting items: ', error);
        res.status(500).json({ error: 'Error getting items'});
    }
}


module.exports = {
    addItem,
    getItems,
    deleteItem
}