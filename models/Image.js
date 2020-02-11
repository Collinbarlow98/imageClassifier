const mongoose = require('mongoose')

var imageSchema = new mongoose.Schema({
  imagePath: String
})

var Image = mongoose.model('Image', imageSchema)

module.exports = Image
