// import data from "../stuff/ListData.json";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Card from '@mui/material/Card';
import { CardContent, Icon, ListItem, ListItemText } from '@mui/material';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';


const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'secondary.main',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
  };

type Item = {
    id: number;
    name: string;
    amount: number;
    unit: string;
    location: string;
}

export function InventoryPage() {

    // FIX: amount shouldn't be negative
    // change order -> last added should be at top
    // error handling for delete

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loc, setLoc] = React.useState('Pantry');
    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('1');
    const [unit, setUnit] = React.useState('piece');
    const [items, setItems] = React.useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');


    const UNITS = ['piece', 'g', 'ml'];
    const LOCATIONS = ['Pantry', 'Fridge', 'Freezer'];
    const UNIT_SUFFIX: Record<string, string> = {
        piece: '',
        ml: 'ml',
        g: 'g'
    }
    const formatAmount = (amount: number, unitType:string) =>
        `${amount}${UNIT_SUFFIX[unitType] ?? ''}`;

    const handleDelete = async (id: number) => {  
        try {
            console.log(id);
            const res = await fetch(`http://localhost:8080/delete-item/${id}`, {
            method: 'DELETE'
            });
            // console.log('delete response: ', res.status);
            fetchData();
        } catch (error) {
            console.error('Delete failed: ', error);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
      setLoc(event.target.value as string);
    };

    const handleChangeUnit = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setUnit(event.target.value as string);
    }

    const handleClick = async () => {
        const b = JSON.stringify({ name, amount, unit, loc });
        console.log("b: " + b);
        try {

            const res = await fetch('http://localhost:8080/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, amount, unit, loc }),
            });
            const data = await res.json();
            fetchData();
            setOpen(false);
            setName('');
            setAmount('1');
            setUnit('piece');
            setLoc('Pantry');

        } catch (err) {
            console.error('Request failed: ', err);
        }
    };

    const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:8080/getitems');
        const result = await response.json();
        setItems(result);
        console.log(result);
    } catch (err) {
        console.error('could not get items: ', err);
    }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase().trim())
    }

    React.useEffect(() => {

        fetchData();
    }, []);





    return (
        <>

            <Box sx={{ minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
             }}>
            
            <Box sx={{ m: 2, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                <Box />
                <Box sx={{ width: 500 }}>
                    <TextField placeholder="Search for an ingredient" value={searchTerm} onChange={handleSearch} fullWidth/>
                </Box>
                <Box sx={{ display: 'flex', 
                    justifySelf: 'end',
                    }}>
                        <IconButton onClick={handleOpen} sx={{ color:'primary.main' }}>
                            <AddCircleIcon fontSize='large' />
                        </IconButton>
                </Box>
            </Box>
                
            <Box sx={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {LOCATIONS.map((location) => (
                    <Card sx={{ width: 300, 
                        height: 'calc(100vh - 180px)',
                        minHeight: 500,
                        m: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderRadius: 1 }} key={location}>
                        <Typography variant="h6" sx={{ m: 2 }}>{location}</Typography>
                        <CardContent sx={{ flex: 1, 
                            overflowY: 'auto', 
                            pl: '35px',
                            backgroundImage: `
                                linear-gradient(to right, transparent 27px, #e57373 27px, #e57373 29px, transparent 29px),
                                repeating-linear-gradient(transparent, transparent 39px, #b8c4d6 39px, #b8c4d6 40px)
                            `,
                            backgroundAttachment: 'local'}}>
                        <List>
                            {items.filter((item) => item.location === location)
                            .filter((item) => item.name.includes(searchTerm))
                            .map((item) => 
                            (<ListItem key={item.id} sx={{
                                '&:hover .hover-button': {
                                    opacity: 1,
                                    visibility: 'visible',
                                }
                            }}>
                                <ListItemText primary={item.name} secondary={formatAmount(item.amount, item.unit)}/>
                                <IconButton
                                    onClick={() => handleDelete(item.id)}
                                    className="hover-button"
                                    sx={{
                                        opacity: 0,
                                        visibility: 'hidden',
                                        transition: 'opacity 0.2s ease-in-out',
                                    }}>
                                    <DeleteIcon fontSize='small'/>
                                </IconButton>
                            </ListItem>))}
                            
                        </List>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            {/* <Box sx={{ display: 'flex', 
                justifyContent: 'center',
                 }}>
                    <IconButton onClick={handleOpen} sx={{ color:'primary.main' }}>
                        <AddCircleIcon fontSize='large' />
                    </IconButton>
            </Box> */}
            </Box>



            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" color='text.primary'>
                Add to the pantry
                </Typography>
                <TextField
                    id="item"    
                    label="Item" 
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <TextField 
                    id="amount" 
                    label="Amount" 
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                <Select
                    labelId="demo-simple-select-label"
                    id="unit"
                    value={unit}
                    onChange={handleChangeUnit}
                >
                    {UNITS.map((u) => (<MenuItem 
                    key={u} 
                    value={u}>
                        {u}
                    </MenuItem>))}
                </Select>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={loc}
                onChange={handleChange}
                >

                    {LOCATIONS.map((l) => (<MenuItem key={l} 
                        value={l}>
                            {l}
                    </MenuItem>))}
                </Select>
                <Button onClick={handleClick}>ADD</Button>
            </Box>
            
            </Modal>
        </>
    );
}