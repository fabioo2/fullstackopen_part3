require('dotenv').config();
const { response } = require('express');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/persons');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
morgan.token(
    'custom',
    ':method :url :status :res[content-length] - :response-time ms :body'
);

app.use(morgan('custom'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then((person) => {
        response.json(person);
    });
});

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id);
//     persons = persons.filter((person) => person.id !== id);
//     res.status(204).end();
// });

app.get('/info', (req, res) => {
    const entries = persons.length;
    const timestamp = new Date();
    res.send(
        `Phonebook has info for ${entries} people <br><br> ${timestamp}`
    );
});

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    // will implement name checking after

    // const exists = persons.some((person) => person.name === name);
    // if (!body.name || !body.number) {
    //     return res.status(400).json({
    //         error: 'The name or number is missing',
    //     });
    // } else if (exists) {
    //     return res.status(400).json({
    //         error: 'Name is already in phone book',
    //     });
    // }

    const person = new Person({
        name: body.name,
        phoneNumber: body.phoneNumber,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
