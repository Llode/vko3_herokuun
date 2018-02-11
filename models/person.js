const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url)

//modelin luonti
// const Person = mongoose.model('Person', {
//     name: String,
//     number: String,
//     id: Number
// })

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

PersonSchema.statics.format = function (person) {
    const formatted = {
        name: person.name || "",
        number: person.number,
        id: person._id
    }
    console.log('format ', formatted)
    return formatted
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person