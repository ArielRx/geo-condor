const express = require('express')
const router = express.Router()

const Forum = require('../models/Forum')

// @desc    Home/Landing page
// @route   GET /
router.get('/', async (req, res) => {
  try {
    const data = await Forum.find();
    res.render('home', {
      layout: 'home',
      data: data
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
// @desc    Dashboard
// @route   GET /dashboard
// router.get('/dashboard', ensureAuth, async (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   })
// })

module.exports = router