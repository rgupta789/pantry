import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useParams } from 'react-router';
import * as React from 'react';

type Recipe = {
    id: number;
    name: string;
    method: string[];
    ingredients: { name: string; amount: number | null; unit: string | null }[];
};


export function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = React.useState<Recipe | null>(null);

    const getRecipe = async () => {
        
        try {
            console.log("rest");
            const response = await fetch(`http://localhost:8080/get-recipe/${id}`);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data: Recipe = await response.json();
            setRecipe(data);

            console.log(recipe);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getRecipe();
    }, []);

    if (!recipe) return <Typography sx={{ m:3 }}>Recipe not found</Typography>


    return (
        <>
        
        <>
            <Box sx={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card sx={{
                        width: 500,
                        bgcolor: 'background',
                        height: 'calc(100vh - 180px)',
                        minHeight: 500,
                        m: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        
                    }}>

                        <Typography variant="h6" sx={{ m: 2 }}>{recipe.name}</Typography>
                        <CardContent sx={{ flex: 1, 
                            overflowY: 'auto', 
                            pl: '35px',
                            backgroundImage: `
                                linear-gradient(to right, transparent 27px, #e57373 27px, #e57373 29px, transparent 29px),
                                repeating-linear-gradient(transparent, transparent 39px, #b8c4d6 39px, #b8c4d6 40px)
                            `,
                            backgroundAttachment: 'local'}}>
                                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                    <Typography variant="h6" sx={{ mt: 4 }}>Ingredients</Typography>
                                    {recipe.ingredients.map((ing, i) => (
                                        <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, py: 0.5 }}>
                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                                            <Typography>
                                                <strong>{ing.amount}{ing.unit === 'piece' ? '' : ing.unit}</strong> {ing.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>


                                <List>
                                    <Typography variant="h6" sx={{ mt: 4 }}>Method</Typography>
                                    {
                                        recipe.method.map((step, index) => (
                                    <ListItem key={index} alignItems="flex-start">
                                        <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'primary.main' }}>
                                            {index + 1}.
                                        </Typography>
                                        <ListItemText primary={step} sx={{ m: 0 }} />
                                    </ListItem>
                                        ))
                                    }
                                </List>
                            </CardContent>
                    </Card>


                </Box>
                <Box>
                    <Link to="/recipes">
                    <IconButton>
                        <KeyboardBackspaceIcon/>
                    </IconButton>
                    </Link>
                </Box>
            </Box>
        </>
            
        </>
    );
}