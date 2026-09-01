const express = require('express');
const app = express();
const db = require('./db');
const cors = require('cors');
const itemsController = require('./controllers/itemsController');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from our server')
})

app.get('/click', (req, res) => {
    res.send('Clicked')
})

app.post('/add', itemsController.addItem);

app.listen(8080, () => (
    console.log('Server listening on port 8080')
))

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })