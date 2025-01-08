const express = require("express");
const app = express();

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

app.get("/info", (req, res) => {
    res.send(
        `Phonebook has info for ${notes.length} people<br/>${new Date().toLocaleString()}`
    );
})

app.get("/info/:id", (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ error: "Note not found" })
    }
})

app.delete("/info/:id", (req, res) => {
    const id = req.params.id
    notes = notes.filter((e) => (e.id !== id))
    res.status(204)
})

app.get("/api/persons", (req, res) => {
    res.json(notes);
})

app.post("/api/persons", (req, res) => {
    if (notes.length >= 500) res.send("Need to upgrade id cant")
    const { name, number } = req.body;
    let id = Math.floor(Math.random() * 1000).toString()
    while (notes.some((e) => (e.id === id)))
        id = Math.floor(Math.random() * 1000).toString()
    notes.push({ name, number, id })
    res.json(notes)
})

app.listen(3001, () => { console.log("Server running in port 3001") })