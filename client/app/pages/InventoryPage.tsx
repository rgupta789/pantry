import data from "../stuff/ListData.json";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export function InventoryPage() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loc, setLoc] = React.useState('Pantry');
    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('1');
    const [unit, setUnit] = React.useState('piece');
    const [items, setItems] = React.useState('');


    const UNITS = ['piece', 'g', 'ml'];
    const LOCATIONS = ['Pantry', 'Fridge', 'Freezer'];
    const UNIT_SUFFIX: Record<string, string> = {
        count: '',
        volume: 'ml',
        mass: 'g'
    }
    const formatAmount = (amount: number, unitType:string) =>
        `${amount}${UNIT_SUFFIX[unitType] ?? ''}`;

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
            // setMessage(data.message);
        } catch (err) {
            console.error('Request failed: ', err);
        }
    };

    React.useEffect(() => {
        console.log("test");
    }, []);



    return (
        <>

            {LOCATIONS.map((location) => (
                <section key={location}>
                    <h3>{location}</h3>
                    <ul>
                        {data.filter((item) => item.location === location).map((item) => (<li key={item.id}>{item.name} {formatAmount(item.amount, item.unit)}</li>))}
                        
                    </ul>
                </section>
            ))}

            <Button onClick={handleOpen}>Add</Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
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
                    {UNITS.map((u) => (<MenuItem key={u} value={u}>{u}</MenuItem>))}
                </Select>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={loc}
                onChange={handleChange}
                >

                    {LOCATIONS.map((l) => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                </Select>
                <Button onClick={handleClick}>ADD</Button>
            </Box>
            
            </Modal>
        </>
    );
}