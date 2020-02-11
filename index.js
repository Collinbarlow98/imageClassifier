const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/imageML', {useNewUrlParser: true})
const Image = require('./models/image')

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

app.get('/', (req,res) => {
  res.render('index')
})

app.get('/savedImages', (req,res) => {
  res.render('savedImages')
})

app.post('/uploadImage', image_upload, (req,res) => {
  var image = new Image({imagePath: '/images/' + req.file.filename})
  image.save().then(res.redirect('/'))
})

app.get('/images', (req,res) => {
  Image.find().then(images => res.send(images))
})

app.listen(PORT, () => {
  console.log('Server is Running...')
})
