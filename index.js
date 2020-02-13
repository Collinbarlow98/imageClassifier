const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000;
require("dotenv").config();

const path = require("path");
const VIEWS_PATH = path.join(__dirname, "/views")
const mustacheExpress = require("mustache-express");

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "partials")));
app.use(express.static(path.join(__dirname, '/public')))
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set("views", "./views");
app.set("view engine", "mustache");

const bodyParser = require('body-parser')

const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://barlowcollin:supersp0rts12@cluster0-mh7gi.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
const Image = require('./models/image')
const User = require('./models/user')

//==========================Upload and Delete Files==========================
const crypto = require('crypto')
const multer = require("multer")
const image_storage = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);

      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
var image_upload = multer({storage: image_storage}).single('image')
//===========================================================================

const session = require("express-session");
app.set("trust proxy", 1)
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false // true - always have cookie (tasty), false - have to do something with session first before you can get cookie
}))

app.get('/', (req,res) => {
  if(req.session.name) {
    const loggedin = 'hidden'
    const loggedout = ''
    let session = {
      loggedin: loggedin,
      loggedout: loggedout,
      email: req.session.email,
      name: req.session.name
    }
    res.render('index', {session: session})
  } else {
    const loggedin = ''
    const loggedout = 'hidden'
    let session = {
      loggedin: loggedin,
      loggedout: loggedout
    }
    res.render('index', {session: session})
  }
})

app.get('/savedImages', (req,res) => {
  if(req.session.name) {
    const loggedin = 'hidden'
    const loggedout = ''
    let session = {
      loggedin: loggedin,
      loggedout: loggedout,
      email: req.session.email,
      name: req.session.name
    }
    res.render('savedImages', {session: session})
  } else {
    const loggedin = ''
    const loggedout = 'hidden'
    let session = {
      loggedin: loggedin,
      loggedout: loggedout
    }
    res.render('savedImages', {session: session})
  }
})

app.post('/uploadImage', image_upload, (req,res) => {
  let email;

  if(req.session.email) {
    email = req.session.email
  } else {
    email = 'guest'
  }
  var image = new Image({imagePath: '/images/' + req.file.filename, userEmail: email})
  image.save().then(res.redirect('/'))
})

app.get('/images', (req,res) => {
  Image.find().then(images => res.send(images))
})

app.get('/register', (req,res) => {
  if(req.session.name) {
    const loggedin = 'hidden'
    const loggedout = ''
    let session = {
      loggedin: loggedin,
      loggedout: loggedout,
      email: req.session.email,
      name: req.session.name
    }
    res.render('register', {session: session})
  } else {
    const loggedin = ''
    const loggedout = 'hidden'
    let session = {
      loggedin: loggedin,
      loggedout: loggedout
    }
    res.render('register', {session: session})
  }
})

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

app.post('/register',(req,res) => {
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword

  if(password === confirmPassword) {
    bcrypt.hash(password, SALT_ROUNDS)
    .then(hash => {
      var user = new User({name: name, email: email, password: hash})
      user.save().then(res.redirect('/'))
    })
  } else {
    res.send('Passwords Did Not Match')
  }
})

app.get('/login',  (req,res) => {
  if(req.session.name) {
    const loggedin = 'hidden'
    const loggedout = ''
    let session = {
      loggedin: loggedin,
      loggedout: loggedout,
      email: req.session.email,
      name: req.session.name
    }
    res.render('login', {session: session})
  } else {
    const loggedin = ''
    const loggedout = 'hidden'
    let session = {
      loggedin: loggedin,
      loggedout: loggedout
    }
    res.render('login', {session: session})
  }
})

app.post('/login',(req,res) => {
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password

  User.findOne({email: email})
  .then(user => {
    if(user) {
      bcrypt.compare(password, user.password)
      .then(success => {
        if(success) {
          if(req.session) {
            req.session.email = user.email
            req.session.name = user.name
            req.session.id = user._id
          }
          res.redirect('/')
        } else {
          res.send('Password Incorrect')
        }
      })
    } else {
      res.send('Email Does Not Exist')
    }
  })
})

app.get('/:email', async function (req,res) {
  let pageUser = await User.findOne({email: req.params.email}).then()
  .catch()

  if(pageUser == undefined) {
    res.status(500).send('User Does Not Exist')
  }

  if(req.session.name) {
    const loggedin = 'hidden'
    const loggedout = ''
    let session = {
      loggedin: loggedin,
      loggedout: loggedout,
      email: req.session.email,
      name: req.session.name
    }
    if(req.session.email === req.params.email) {
      pageUser.hidden = ''
    } else {
      pageUser.hidden = 'hidden'
    }


    res.render('account', {session: session, pageUser: pageUser })
  } else {
    const loggedin = ''
    const loggedout = 'hidden'
    let session = {
      loggedin: loggedin,
      loggedout: loggedout
    }

    pageUser.hidden = 'none'

    res.render('account', {session: session, pageUser: pageUser})
  }
})

app.get('/:email/accountImages', (req,res) => {
  Image.find({userEmail: req.params.email}).then(images => res.send(images))
})

app.listen(PORT, () => {
  console.log('Server is Running...')
})
