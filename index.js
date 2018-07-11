const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

app.get('/info', (req, res) => {
  res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
	    <p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {

  if (request.body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (request.body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  if (persons.findIndex(person => person.name === request.body.name) != -1) {
    return response.status(400).json({ error: 'name already exists' })
  }
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  person.id = Math.floor(Math.random() * 1000000)
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

