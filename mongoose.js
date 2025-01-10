import mongoose from 'mongoose'
import fs from 'fs'

const URI = fs.readFileSync('../.env', 'utf8').match(/(?<=^URI ?= ?").*(?=")/gm)[0]

const generateId = async () => {
    return await Persons
        .find({})
        .then((res) => {
            let r = res.map((e) => (e.id))
            return Math.max(...r) + 1
        })
}

if (process.argv.length >= 3) {
    const database = 'Persons'
    const password = process.argv[2]
    const mongoDB = URI.replace('[password]', password).replace('[database]', database)
    mongoose.connect(mongoDB)
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
    const person = mongoose.Schema({
        id: Number,
        name: String,
        number: Number,
    })
    person.set('toObject', {
        transform: (document, returnedObject) => {
            delete returnedObject._id
            delete returnedObject.__v
        }
    })
    var Persons = new mongoose.model('persons', person)
}
if (process.argv.length === 3) {
    Persons
        .find({})
        .then((res) => {
            console.log(res)
            console.log('phonebook:')
            res.forEach((e) => {
                console.log(`${e.name} ${e.number}`)
            })
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            mongoose.connection.close()
        })
} else if (process.argv.length === 5) {
    let id = await generateId()
    const newPerson = new Persons({
        id: id,
        name: process.argv[3],
        number: process.argv[4],
    })
    newPerson
        .save()
        .then((res) => {
            console.log(`${process.argv[3]} with number ${process.argv[4]} was saved`)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            mongoose.connection.close()
        })
} else {
    console.log('Incorrect amount of arguments')
    console.log('Usage:')
    console.log('\tnode mongoose.js mongodb_password')
    console.log('\t\tlist all persons in the database')
    console.log('\tnode mongoose.js mongodb_password <name> <number>')
    console.log('\t\tadd person with number to database')
}
