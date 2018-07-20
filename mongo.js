
const mongoose = require('mongoose')


// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://fullstack:salainen1@ds245661.mlab.com:45661/persons'

mongoose.connect(url, options = { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length == 2) {
  console.log("puhelinluettelo:")
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}
else if (process.argv.length == 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${response.name} numero ${response.number} luetteloon`)
      mongoose.connection.close()
    })
}

