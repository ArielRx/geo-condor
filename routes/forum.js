const express = require('express');
const router = express.Router();

const Forum = require('../models/Forum')

// @desc    Show forum page
// @route   GET /forum
router.get('/', (req, res) => {
  res.render('forum', {
    layout: 'forum',
  })
})

// @desc    Add new forum post
// @route   POST /forum
router.post('/add', async (req, res) => {
  try {
    await Forum.create(req.body)
   res.redirect('/')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Send all forum posts
// @route   GET /forum
router.get('/get', async (req, res) => {
  try {
    const forum = await Forum.find();

    res.send(forum);

    // res.render('forum/home', {
    //   forum,
    // })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router;
