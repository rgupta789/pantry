const db = require('../db');

async function getRecipeNames(req, res) {
    try {
        const result = await db.query('SELECT id, name FROM recipes ORDER BY name;');
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: 'Error getting recipes' });
    }
}

module.exports = {
    getRecipeNames,
}