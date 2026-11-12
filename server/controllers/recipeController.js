const db = require('../db');

async function getRecipeNames(req, res) {
    const searchText = (req.query.q ?? '').toString().trim();
    console.log(searchText);
    try {
        const result = await db.any(`
            SELECT r.id, r.name,
                CASE WHEN $1 = '' THEN NULL ELSE (
                    SELECT string_agg(ri.name, ', ' ORDER BY ri.id)
                    FROM recipe_ingredients ri
                    WHERE ri.recipe_id = r.id AND ri.name ILIKE '%' || $1 || '%'
                ) END AS matched_ingredients
            FROM recipes r
            WHERE $1 = ''
            OR r.name ILIKE '%' || $1 || '%'
            OR EXISTS (
                SELECT 1 FROM recipe_ingredients ri
                WHERE ri.recipe_id = r.id AND ri.name ILIKE '%' || $1 || '%'
            )
            ORDER BY r.name;
            `,
        [searchText]);
        res.json(result);

        
    } catch (error) {
        console.error('Error getting recipes: ', error);
        res.status(500).json({ error: 'Error getting recipes' });
    }
}

async function addRecipe(req, res) {
    const { name, method, ingredients } = req.body.form;

    if (!name || method.length === 0 || ingredients.length === 0) {
        return res.status(400).json({ error: 'name, ingredients and method are required'})
    }

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

async function getRecipe(req, res) {
    const id = req.params.id;
    try {
        const recipe = await db.oneOrNone(
            `SELECT r.id, r.name, r.method,
                    COALESCE(
                        json_agg(
                            json_build_object('name', ri.name, 'amount', ri.amount, 'unit', ri.unit)
                            ORDER BY ri.id
                        ) FILTER (WHERE ri.id IS NOT NULL),
                        '[]'
                    ) AS ingredients
             FROM recipes r
             LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
             WHERE r.id = $1
             GROUP BY r.id`,
            [id]
        );

        res.status(201).json(recipe);

    } catch (error) {

        res.status(500).json({ error })
    }

}

async function deleteRecipe(req, res) {

    const id = req.params.id;
    try {
        const result = await db.oneOrNone('DELETE FROM recipes WHERE id = $1 RETURNING id', [id]);
        res.status(204).send();

    } catch (error) {
        console.error('Request failed: ', error);
    }

}


module.exports = {
    getRecipeNames,
    addRecipe,
    getRecipe,
    deleteRecipe,
}