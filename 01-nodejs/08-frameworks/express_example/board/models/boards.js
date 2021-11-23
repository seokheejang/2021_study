const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: { type: String, default: '', index: true, unique: true },
  title: { type: String, default: '' },
  price: { type: Number, default: 0 },
  rmk: { type: String, default: '' }
})

module.exports = mongoose.model('Board', boardSchema)