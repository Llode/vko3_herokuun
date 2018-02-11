const express = require('express')
const bodyParser = require('body-parser')
const repl = require('repl')
const date = require('date-and-time')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('type', (req, res) => {
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

// const formatPerson = (person) => {
//     return {
//         name: person.name,
//         number: person.number,
//         id: person.id
//     }
// }

//infosivu
app.get('/api/info', (req, res) => {
    const txt = `<ul>Puhelinluettelossa on ${personCount()} henkilön tiedot <BR/> ${now}</ul>`
    res.send(txt)
})

//testaus
// app.get('/api', (req, res) => {
//     res.send('<hi>ASD</h1>')
// })

//hae kaikki persoonat
app.get('/api/persons', (req, res) => {
    //res.json(persons)
    Person
        .find({})
        .then(persons => {
            console.log('listatyyppi', typeof persons)
            res.json(persons.map(Person.format))
            // mongoose.connection.close()
        })
        .catch(err => {
            console.log(error)
            res.status(404).end()
        })
})

//hae joku persoona
// app.get('/api/persons/:id', (req, res) => {
//     const id = Number('getID ', req.params.id)
//     const person = persons.find(note => note.id === id)
//     console.log('iidee',id)
//     if (person) {
//         res.json(person)
//     } else {
//         res.status(404).end()
//     }
// })

//hae joku persoona mongosta
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log('hakuiidee ', id)
    Person
        .findById(id)
        .then(person => {
            console.log('haettava ', person)
            res.json(Person.format(person))

        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

//poista ukkeli.
// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number('deleteID ', req.params.id)
//     persons = persons.filter(person => person.id !== id)

//     res.status(204).end()
// })

//poista ukkeli mongosta
app.delete('/api/persons/:id', (req, res) => {
    const delid = req.params.id
    console.log('poistid', delid)

    Person.findByIdAndRemove(delid).then(() => {
        res.status(204).send('success!')
    }).catch(err => {
        console.log(err)
        res.status(404).end()
    })
})

//id-generointi
const generateId = () => {
    max = 600
    const maxId = Math.floor(Math.random() * Math.floor(max))
    console.log('idnro ', maxId)
    return maxId
}

//luo uusi ukkeli
// app.post('/api/persons', (req, res) => {
//     const body = req.body
//     const check = persons.find(person => person.name === body.name)
//     console.log('check ', check, typeof check)
//     console.log('body ', body, typeof body)
//     if (body.name === "" || body.name === undefined) {
//         return res.status(400).json({ error: 'Name is missing!' })
//     }
//     if (body.number === "" || body.number === undefined) {
//         return res.status(400).json({ error: 'Number is missing!' })
//     }
//     if (check && check.name === body.name && body.number !== undefined) {
//         return res.status(400).json({ error: 'Name must be unique!' })

//     }
//     const person = {
//         name: body.name,
//         number: body.number,
//         id: generateId()
//     }

//     persons = persons.concat(person)

//     res.json(person)
// })

//ukkelin päivitys
app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    console.log('body ', body)

    const person = {
        number: body.number
    }
    console.log('person ', person)
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(update => {
            console.log('update ', update)
            res.json(Person.format(update))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'no id found' })
        })
})

//luo uusi ukkeli mongoon
app.post('/api/persons', (req, res) => {
    const body = req.body
    const bodyName = String(body.name)
    let namecheck = ""
    let persoona = {}
    Person.findOne({ name: body.name })
        .then(pers => {
            ({ namecheck, persoona } = initPersonSave(pers, namecheck, persoona));
        })
        .then(() => {
            console.log('toka pers ', persoona)
            console.log('check ', namecheck, typeof checkName)
            console.log('bodyname ', bodyName, typeof body)
            if (body.name === "" || body.name === undefined) {
                return res.status(400).send({ error: 'Name is missing!' })
            }
            if (body.number === "" || body.number === undefined) {
                return res.status(400).send({ error: 'Number is missing!' })
            }
            if (namecheck && namecheck === body.name && body.number !== undefined) {
                return res.status(400).send({ error: 'Name must be unique!' })

            } else {
                createAndSavePerson(bodyName, body, res);
            }
        })
})

//määrittää muuttujat savea varten
function initPersonSave(pers, namecheck, persoona) {
    if (pers) {
        namecheck = String(pers.name);
        persoona = pers;
        console.log('eka pers', pers);
    }
    return { namecheck, persoona };
}

//luo ja tallentaa uuden persoonan
function createAndSavePerson(bodyName, body, res) {
    person = new Person({
        name: bodyName,
        number: body.number,
        id: generateId()
    }).save().then(saved => {
        console.log(saved);
        res.json(Person.format(saved));
    })
        .catch(err => {
            console.log(err);
            res.status(404).send({ err: 'Something went wong' });
        });
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})