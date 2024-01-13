const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("<h1>Home</h1>")
})

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`)
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: "name is missing"
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: "number is missing"
        })
    }

    if (persons.filter(person => person.name === body.name).length != 0) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const id = Math.floor(Math.random() * 500)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})