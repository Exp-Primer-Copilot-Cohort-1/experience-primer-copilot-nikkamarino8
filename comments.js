// Create web server

// Import Express
const express = require('express')
const app = express()

// Import handlebars
const exphbs = require('express-handlebars')

// Import body-parser
const bodyParser = require('body-parser')

// Import method-override
const methodOverride = require('method-override')

// Import mongoose
const mongoose = require('mongoose')

// Import models
const Comment = require('./models/comment')

// Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// Setting method-override
app.use(methodOverride('_method'))

// Connect to database
mongoose.connect('mongodb://localhost/comment', { useNewUrlParser: true })
const db = mongoose.connection

// Connect to error
db.on('error', () => {
  console.log('mongodb error!')
})

// Connect to success
db.once('open', () => {
  console.log('mongodb connected!')
})

// Setting routes
app.get('/', (req, res) => {
  Comment.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(comments => res.render('index', { comments }))
    .catch(error => console.log(error))
})

app.get('/comments/new', (req, res) => {
  res.render('new')
})

app.post('/comments', (req, res) => {
  const comment = req.body
  Comment.create(comment)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/comments/:id', (req, res) => {
  const id = req.params.id
  Comment.findById(id)
    .lean()
    .then(comment => res.render('show', { comment }))
    .catch(error => console.log(error))
})

app.get('/comments/:id/edit', (req, res) => {
  const id = req.params.id
  Comment.findById(id)
    .lean()
    .then(comment => res.render('edit', { comment }))
    .catch(error => console.log(error))
})

app.put('/comments/:id', (req, res) => {
  const id = req.params.id
  const comment = req.body
  Comment.findByIdAndUpdate(id, comment)
    .then(() => res.redirect(`/comments/${id}`))
    .catch(error => console.log(error))
})

app
