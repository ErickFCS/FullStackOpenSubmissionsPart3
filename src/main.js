console.clear()
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import person from "./models/person.js";
const app = express();
app.set('etag', false);

var notes = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static("dist"))

app.get("/info", async (req, res) => {
    const notes = await person.find({})
    res.send(
        `Phonebook has info for ${notes.length} people<br/>${new Date().toLocaleString()}`
    );
})

app.get("/info/:id", async (req, res) => {
    const id = req.params.id
    const note = await person.find({ id: id })
    console.log(note);
    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ error: "Note not found" })
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    notes = notes.filter((e) => (e.id !== id))
    res.status(204).end()
})

app.get("/api/persons", async (req, res) => {
    const notes = await person.find({})
    res.json(notes);
})

app.post("/api/persons", async (req, res) => {
    const { name, number } = req.body;
    if (!name) {
        res.json({ error: "name must be given" })
        return
    }
    if (!number) {
        res.json({ error: "number must be given" })
        return
    }
    const notes = await person.find({})
    if (notes.some((e) => (e.name === name))) {
        res.json({ error: "name must be unique" })
        return
    }
    const newNote = new person({ name, number })
    const { id } = await newNote.save()
    console.log(id);
    res.json(notes.concat({ name, number, id }))
})

app.put("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const index = notes.findIndex((e) => (e.id === id))
    if (index === -1) {
        res.json({ error: "id doesn't exist" })
        return
    }
    const { name, number } = req.body;
    if (!name) {
        res.json({ error: "name must be given" })
        return
    }
    if (!number) {
        res.json({ error: "number must be given" })
        return
    }
    if (notes[index].name !== name) {
        res.json({ error: "name is different" })
        return
    }
    notes.splice(index, 1, { name, number, id })
    res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`Server running in port ${PORT}`) })