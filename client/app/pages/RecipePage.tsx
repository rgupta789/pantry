// import Recipes from '../stuff/Recipes.json';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemText } from '@mui/material';
import { Link } from 'react-router';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSearchParams } from 'react-router';
import { PanoramaSharp } from '@mui/icons-material';

const Modalstyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'secondary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    maxHeight: '90vh',
    overflow: 'hidden',
  };

type RecipeSummary = {
    id: number,
    name: string,
};

type IngredientInput = {
    name: string;
    amount: string;
    unit: string;
}

type RecipeForm = {
    name: string;
    ingredients: IngredientInput[];
    method: string[];
}


export function RecipePage() {
    const [recipes, setRecipes] = React.useState<RecipeSummary[]>([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [snack, setSnack] = React.useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error'
    }>({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = React.useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const UNITS = ['piece', 'g', 'ml'];

    const emptyForm: RecipeForm = {
        name: '',
        ingredients: [{
            name: '', amount: '1', unit: 'piece',
        }],
        method: ['']
    };
    const [form, setForm] = React.useState<RecipeForm>(emptyForm);

    const formIsValid =
        form.name.trim() !== '' &&
        form.method.some(s => s.trim() != '') &&
        form.ingredients.some(i => i.name.trim() !== '');


    const addIngredient = () => {
        setForm(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', amount: '1', unit: 'piece' }],
        }));
    };

    const removeIngredient = (index: number) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const removeStep = (index: number) => {
        setForm(prev => ({
            ...prev,
            method: prev.method.filter((_, i) => i != index)
        }));
    };

    const addStep = () => {
        setForm(prev => ({
            ...prev,
            method: [...prev.method, ''],
        }));
    };

    const updateStep = (index: number, value: string) => {
        setForm(prev => ({
            ...prev,
            method: prev.method.map((s, i) => (i === index ? value : s))
        }));
    };

    

    const handleAddRecipe = async () => {

        console.log(JSON.stringify({ form }));
        try {
            const res = await fetch('http://localhost:8080/add-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ form })
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);

            await res.json();

            setSnack({ 
                open: true,
                message: 'Recipe added!',
                severity: 'success'
            });
            setOpenModal(false);

            getRecipes();
            setForm(emptyForm);

        } catch (error) {
            console.log('Adding failed: ', error);
            setSnack({ open: true, message: 'Could not add recipe.', severity: 'error' });
        }

    };

    const getRecipes = async () => {
        try {
            const result = await fetch (`http://localhost:8080/get-recipe-names?q=${encodeURIComponent(q)}`);
            setRecipes(await result.json());
            
        } catch (error) {
            console.log('Request failed: , error');
        }
        // try {
        //     const response = await fetch('http://localhost:8080/get-recipe-names');
        //     const result = await response.json();
        //     setRecipes(result);
        // } catch (error) {
        //     console.error(error);
        // }
    };

    const updateIngredient = (
        index: number,
        field: keyof IngredientInput,
        value: string
    ) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            ),
        }));
    };    

    const handleDelete = async (id: number) => {

        try {
            console.log(id);
            const result = await fetch(`http://localhost:8080/delete-recipe/${id}`, {
                method: 'DELETE'
            });

            getRecipes();

        } catch (error) {
            console.error(error);
        }
    }

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // setSearchTerm(e.target.value.toLowerCase().trim());
        setSearchParams({ q: e.target.value }, { replace: true });
        // try {
        //     const result = await fetch (`http://localhost:8080/get-recipe-names?q=${encodeURIComponent(q)}`);
        //     setRecipes(await result.json());
            
        // } catch (error) {
        //     console.log('Request failed: , error');
        // }
    }




    React.useEffect(() => {
        getRecipes();
    }, [q])



    return (
        <>
            <Box sx={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>

                <Box sx={{ m: 2, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                    <Box />
                    <Box sx={{ width: 500 }}>
                        <TextField placeholder="Search for a recipe or an ingredient" value={q} onChange={handleSearch} fullWidth/>
                    </Box>
                    <Box sx={{ display: 'flex', 
                        justifySelf: 'end'
                        }}>
                            <IconButton onClick={handleOpen} sx={{ color:'primary.main' }}>
                                <AddCircleIcon fontSize='large' />
                            </IconButton>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card sx={{
                        width: 500,
                        bgcolor: 'background.paper',
                        height: 'calc(100vh - 180px)',
                        minHeight: 400,
                        m: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        
                    }}>

                        <Typography variant="h6" sx={{ m: 2 }}>Recipes</Typography>
                        <CardContent sx={{ flex: 1, 
                            overflowY: 'auto', 
                            pl: '35px',
                            backgroundImage: `
                                linear-gradient(to right, transparent 27px, #e57373 27px, #e57373 29px, transparent 29px),
                                repeating-linear-gradient(transparent, transparent 39px, #b8c4d6 39px, #b8c4d6 40px)
                            `,
                            backgroundAttachment: 'local'}}>
                                <List>
                                    {recipes.map((recipe) => (
                                        <ListItem
                                            key={recipe.id}
                                            disablePadding
                                            sx={{ '&:hover .hover-button': { opacity: 1, visibility: 'visible' } }}
                                            secondaryAction={
                                                <IconButton
                                                    className="hover-button"
                                                    onClick={() => handleDelete(recipe.id)}
                                                    sx={{ opacity: 0, visibility: 'hidden', transition: 'opacity 0.2s ease-in-out' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemButton component={Link} to={`/recipes/${recipe.id}`}>
                                                <ListItemText primary={recipe.name} />
                                            </ListItemButton>
                                        </ListItem>



                                    ))}
                                </List>
                            </CardContent>
                    </Card>

                </Box>

            </Box>

            

            <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={Modalstyle}>

                    <Box sx={{ 
                        flex: 1,
                        minHeight: 0,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        overflowY: 'auto',
                        }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add a recipe
                    </Typography>
                    <TextField
                        id="name"    
                        label="Recipe Name" 
                        variant="outlined"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />

                    {form.ingredients.map((ing, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                label="Ingredient"
                                value={ing.name}
                                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                            />
                            <TextField
                                label="Amount"
                                type="number"
                                value={ing.amount}
                                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                            />
                            <Select
                                value={ing.unit}
                                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                            >
                                {UNITS.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                            </Select>

                            <IconButton
                                onClick={() => removeIngredient(i)}
                                disabled={form.ingredients.length === 1}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addIngredient}>Add ingredient</Button>

                    {form.method.map((s, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                multiline
                                label="Step"
                                value={s}
                                onChange={(e) => updateStep(i, e.target.value)}
                            />

                            <IconButton
                                onClick={() => removeStep(i)}
                                disabled={form.ingredients.length === 1}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addStep}>Add Step</Button>

                    <Button onClick={handleAddRecipe} disabled={!formIsValid}>Submit</Button>

                    </Box>

                </Box>

            
            </Modal>


            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snack.severity}
                    variant="filled"
                    onClose={() => setSnack(prev => ({ ...prev, open: false }))}
                >
                    {snack.message}   
                </Alert>

            </Snackbar>



        </>
    );
}