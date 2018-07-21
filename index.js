const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const morgan = require('morgan')
morgan.token('jsoncontent', function getJsonContent(req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :jsoncontent :status :res[content-length] - :response-time ms'))
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const Person = require('./models/person')



app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
	    <p>${new Date()}</p>`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(Person.format(updatedPerson))
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {

  if (request.body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (request.body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  Person
    .find({ name: person.name })
    .then(persons => {
      if (persons.length > 0) {
        response.status(400).send({ error: `name ${person.name} already exists` })
      }
      else {
        return person.save()
      }
    })
    .then(savedPerson => {
      response.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

