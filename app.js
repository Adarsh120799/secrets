require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encryption = require('mongoose-encryption')
const app = express()

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const userdata = new mongoose.Schema({
  email: String,
  password: String
})

userdata.plugin(encryption, {
  secret: process.env.SECRETS,
  encryptionFields: ['password'],
  excludeFromEncryption: ['email']
})
const User = new mongoose.model('User', userdata)

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  })
  user.save(err => {
    if (err) {
      console.log(err)
    } else {
      res.render('secrets')
    }
  })
})

app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/login', (req, res) => {
  User.findOne({ email: req.body.username }, (err, finduser) => {
    if (err) {
      console.log('error')
    } else {
      if (finduser) {
        if (finduser.password === req.body.password) {
          res.render('secrets')
        }
      }
    }
  })
})

app.listen(5500, () => {
  console.log('server started on the port 5500')
})
