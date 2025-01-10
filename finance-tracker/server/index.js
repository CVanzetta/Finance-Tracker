const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/hello', (request, response) => {
    response.json({ message: "Hello " + request.body.name });
});

app.listen(8000, () => {
    console.log('Server started')
});