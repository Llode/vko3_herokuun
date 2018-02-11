const mongoose = require('mongoose')


const url = 'mongodb://puhelinluettelo:feikkipassu123@ds229418.mlab.com:29418/fullstack_kanta'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})


const pers = process.argv[2]
const nro = process.argv[3]

const generateId = () => {
    max = 600
    const maxId = Math.floor(Math.random() * Math.floor(max))
    console.log('idnro ', maxId)
    return maxId
}

if (process.argv.length !== 4) {
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach(hunam => {
                console.log(hunam.name, ': ', hunam.number)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: pers,
        number: nro,
        id: generateId()
    })
    console.log('Lisätään henkilö ', { pers }, ' numerolla ',
        { nro }, ' hupelinluetteloon')

    person
        .save()
        .then(response => {
            console.log('person saved!')
            mongoose.connection.close()
        })
}