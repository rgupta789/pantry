const db = require('../db');

async function getRecipeNames(req, res) {
    try {
        const result = await db.query('SELECT id, name FROM recipes ORDER BY name;');
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: 'Error getting recipes' });
    }
}

async function addRecipe(req, res) {
    const { name, method, ingredients } = req.body.form;
    console.log(method);
    try {
        const recipe = await db.one(
            'INSERT INTO recipes (name, method) VALUES ($1, $2) RETURNING id',
            [name, method]
        );

        for (const i of ingredients) {
            console.log(recipe.id);
            console.log(i.name);
            await db.none(
                'INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES ($1, $2, $3, $4)',
                [recipe.id, i.name, i.amount, i.unit]
            )
        };

        res.status(201).json(recipe);


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding recipe' });
    }
}


module.exports = {
    getRecipeNames,
    addRecipe,
}