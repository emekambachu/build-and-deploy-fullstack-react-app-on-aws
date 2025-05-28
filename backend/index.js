const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;

app.use(express.json());

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.get('/task', async (req, res) => {
    res.send('Task!');
});

app.put('/task', async (req, res) => {
    res.send('Task!');
});

app.delete('/task', async (req, res) => {
    res.send('Task!');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});