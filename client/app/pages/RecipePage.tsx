// import Recipes from '../stuff/Recipes.json';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/List';
import { ListItemText } from '@mui/material';
import { Link } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d04e97'
        },
        background: {
            paper: '#fdedc9'
        },
    },
    shape: {
        borderRadius: 24
    }
});

type RecipeSummary = {
    id: number,
    name: string,
};


export function RecipePage() {
    const [recipes, setRecipes] = React.useState<RecipeSummary[]>([]);


    const getRecipes = async () => {
        try {
            const response = await fetch('http://localhost:8080/get-recipe-names');
            const result = await response.json();
            setRecipes(result);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        getRecipes();
    }, [])

    return (
        <>
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <Box>
                    <Link to="/">
                    <IconButton>
                        <KeyboardBackspaceIcon/>
                    </IconButton>
                    </Link>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card sx={{
                        width: 500,
                        bgcolor: 'background',
                        height: 800,
                        m: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        
                    }}>

                        <Typography variant="h6" sx={{ m: 2, color: '#5c5c5c'}}>Recipes</Typography>
                        <CardContent sx={{ flex: 1, 
                            overflowY: 'auto', 
                            color: '#5c5c5c',
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { background: '#e670ab', borderRadius: 4 },
                            '&::-webkit-scrollbar-thumb:hover': { background: '#ee81b8' },
                            pl: '35px',
                            backgroundImage: `
                                linear-gradient(to right, transparent 27px, #e57373 27px, #e57373 29px, transparent 29px),
                                repeating-linear-gradient(transparent, transparent 39px, #b8c4d6 39px, #b8c4d6 40px)
                            `,
                            backgroundAttachment: 'local'}}>
                                <List>
                                    {recipes.map((recipe) => (
                                        <ListItemButton component={Link} to={`/recipes/${recipe.id}`}key={recipe.id}>
                                            <ListItemText primary={recipe.name}></ListItemText>
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                    </Card>

                </Box>

            </Box>
        </ThemeProvider>
            
        </>
    );
}