console.clear()
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import person from './models/person.js'
const app = express()
app.set('etag', false)

app.use(express.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/info', async (req, res) => {
    const persons = await person.find({})
    res.send(
        `Phonebook has info for ${persons.length} people<br/>${new Date().toLocaleString()}`
    )
})

app.get('/info/:id', async (req, res, next) => {
    const id = req.params.id
    const note = await person
        .find({ _id: id })
        .catch((err) => {
            next(err)
        })
    if (!note) return
    if (note.length) {
        res.json(note)
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
})

app.get('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id
    const note = await person
        .find({ _id: id })
        .catch((err) => {
            next(err)
        })
    if (!note) return
    if (note.length) {
        res.json(note)
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
})

app.delete('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id
    let r = await person
        .deleteOne({ _id: id })
        .catch((err) => {
            next(err)
        })
    if (r && !r.deletedCount) {
        res.status(404).end()
    }
    res.status(204).end()
})

app.get('/api/persons', async (req, res) => {
    const persons = await person.find({})
    res.json(persons)
})

app.post('/api/persons', async (req, res, next) => {
    const { name, number } = req.body
    if (!name) {
        res.json({ error: 'name must be given' })
        return
    }
    if (!number) {
        res.json({ error: 'number must be given' })
        return
    }
    const persons = await person.find({})
    if (persons.some((e) => (e.name === name))) {
        res.json({ error: 'name must be unique' })
        return
    }
    const newNote = new person({ name, number })
    const { id } = await newNote
        .save()
        .catch((err) => {
            next(err)
            return { id: undefined }
        })
    if (!id) return
    res.json(persons.concat({ name, number, id }))
})

app.put('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id
    const target = await person
        .find({ _id: id })
        .catch((err) => {
            next(err)
        })
    if (!target) return
    if (target.length === 0) {
        res.json({ error: 'id doesn\'t exist' })
        return
    }
    const { name, number } = req.body
    if (!name) {
        res.json({ error: 'name must be given' })
        return
    }
    if (!number) {
        res.json({ error: 'number must be given' })
        return
    }
    if (target[0].name !== name) {
        res.json({ error: 'name is different' })
        return
    }
    const r = await person
        .updateOne({ _id: id }, { $set: { name, number } }, { runValidators: true })
        .catch((err) => {
            next(err)
            return undefined
        })
    if (!r) return
    const persons = await person.find({})
    res.json(persons)
})

app.use((err, req, res, next) => {

    console.error(err)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        if (err.errors.name)
            res.status(400).json({ error: err.errors.name.message })
        else if (err.errors.number)
            res.status(400).json({ error: err.errors.number.message })
        else
            res.status(400).json({ error: 'Validation error' })

    }

    next(err)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`Server running in port ${PORT}`) })