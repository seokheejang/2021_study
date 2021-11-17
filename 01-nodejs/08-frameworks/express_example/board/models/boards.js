const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const boardSchema = new Schema({
  name: { type: String, default: '', index: true, unique: true },
  title: { type: String, default: '' },
  lv: { type: Number, default: 0 },
  rmk: { type: String, default: '' }
})

module.exports = mongoose.model('Board', boardSchema);