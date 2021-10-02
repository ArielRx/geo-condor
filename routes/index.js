const express = require('express')
const router = express.Router()

// @desc    Home/Landing page
// @route   GET /
router.get('/', (req, res) => {
  res.render('home', {
    layout: 'home',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
// router.get('/dashboard', ensureAuth, async (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   })
// })

module.exports = router