require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
// const mongoose = require("mongoose")
const Person = require("./models/person")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))
app.use(morgan((tokens, req, res) => (
    [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
        JSON.stringify(req.body)
    ].join(" ")
)))

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendieck",
//         number: "39-23-6423122"
//     }
// ]

app.get("/", (req, res) => {
    res.send("<h1>Home</h1>")
})

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>`)
    })
})

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: "name missing" })
    }

    if (body.number === undefined) {
        return res.status(400).json({ error: "number missing" })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})