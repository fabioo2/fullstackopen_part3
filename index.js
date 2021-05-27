const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/persons');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }
};

morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token(
    'custom',
    'Method: :method \nPath: :url \nStatus: :status  \nResponse: :res[content-length] - :response-time ms \nBody: :body \n---'
);

app.use(morgan('custom'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log('ruh roh');
            next(error);
        });
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
    const timestamp = new Date();
    Person.countDocuments((error, count) => {
        res.send(
            `Phonebook has entries for ${count} people <br><br> ${timestamp}`
        );
    }).catch((error) => {
        next(error);
    });
});

app.post('/api/persons/', (request, response, next) => {
    const body = request.body;

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

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        phoneNumber: body.phoneNumber,
    };

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true,
        runValidators: true,
    })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndPoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
