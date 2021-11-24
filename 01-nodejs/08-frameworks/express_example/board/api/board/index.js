// const router = require('express').Router();
// const Board = require('../../models/boards');

// router.get('/read/:name', (req, res, next) => {
//   const name = req.params.name
//   Board.findOne({ name })
//     .then(r => {
//       res.send({ success: true, d: r })
//     })
//     .catch(e => {
//       res.send({ success: false, msg: e.message })
//     })
// })

// router.get('/list', (req, res, next) => {
//   Board.find().sort({ price })
//     .then(rs => {
//       res.send({ success: true, ds: rs })
//     })
//     .catch(e => {
//       res.send({ success: false, msg: e.message })
//     })
// })

// module.exports = router;