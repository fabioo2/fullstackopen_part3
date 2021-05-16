const { response } = require('express');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

let persons = [
    {
        id: 1,
        name: 'Fabio Kim',
        number: '226-504-1228',
    },
    {
        id: 2,
        name: 'Haemin Park',
        number: '226-504-0824',
    },
    {
        id: 3,
        name: 'Seung Kim',
        number: '226-228-8557',
    },
    {
        id: 4,
        name: 'The Police',
        number: '911',
    },
    {
        id: 5,
        name: 'Backend',
        number: '555-5555',
    },
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

app.get('/info', (req, res) => {
    const entries = persons.length;
    const timestamp = new Date();
    res.send(
        `Phonebook has info for ${entries} people <br><br> ${timestamp}`
    );
});

const generateId = () => {
    const id = Math.floor(Math.random() * 10000);
    return id;
};

app.post('/api/persons/', (req, res) => {
    const body = req.body;
    const name = body.name;
    const exists = persons.some((person) => person.name === name);
    console.log(exists);

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'The name or number is missing',
        });
    } else if (exists) {
        return res.status(400).json({
            error: 'Name is already in phone book',
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);
    res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
