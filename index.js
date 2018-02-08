const express = require('express')
const bodyParser = require('body-parser')
const repl = require('repl')
const date = require('date-and-time')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('type', (req,res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Martti Tienari",
        number: "040-123456"
    },
    {
        id: 3,
        name: "Arto Järvinen",
        number: "040-123456"
    },
    {
        id: 4,
        name: "Lea Kutvonen",
        number: "040-123456"
    },
    {
        id: 5,
        name: "letti",
        number: "040-123456"
    }
]

personCount = () => {
    const max = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
    console.log(max, typeof max, typeof arr)
    return max
}

let now = new Date();



app.get('/api/info', (req, res) => {
    const txt = `<ul>Puhelinluettelossa on ${personCount()} henkilön tiedot <BR/> ${now}</ul>`
    res.send(txt)
})

app.get('/api', (req, res) => {
    res.send('<hi>ASD</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number('getID ', req.params.id)
    const person = persons.find(note => note.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number('deleteID ', req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    max = 600
    const maxId = Math.floor(Math.random() * Math.floor(max))
    console.log('idnro ', maxId)
    return maxId
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const check = persons.find(person => person.name === body.name)
    console.log('check ', check, typeof check)
    console.log('body ', body, typeof body)
    if (body.name === "" || body.name === undefined) {
        return res.status(400).json({ error: 'Name is missing!' })
    }
    if (body.number === "" || body.number === undefined) {
        return res.status(400).json({ error: 'Number is missing!' })
    }
    if (check && check.name === body.name && body.number !== undefined) {
        return res.status(400).json({ error: 'Name must be unique!' })

    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})