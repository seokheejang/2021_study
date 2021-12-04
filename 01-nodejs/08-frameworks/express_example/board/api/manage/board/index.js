const router = require('express').Router()
const createError = require('http-errors')
const Board = require('../../../models/boards')

router.post('/', (req, res, next) => {
  Board.create(req.body)
    .then(r => {
      res.send({ success: true, msg: r })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.get('/', function(req, res, next) {
  Board.find().sort({ price : -1 })
    .then(rs => {
      res.send({ success: true, ds: rs })
    })
    .catch(e => {
      res.send({ success: false })
    })
})

router.put('/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.updateOne({ _id }, { $set: req.body})
    .then(r => {
      res.send({ success: true, msg: r })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.delete('/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.deleteOne({ _id })
    .then(r => {
      res.send({ success: true, msg: r })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.put('/like/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.updateOne({ _id }, { $inc: {like: 1} })
    .then(r => {
      res.send({ success: true, msg: r })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.put('/unlike/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.updateOne({ _id }, { $inc: {like: -1} })
    .then(r => {
      res.send({ success: true, msg: r })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})


module.exports = router;