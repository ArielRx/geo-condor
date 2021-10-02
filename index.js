const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: "./config/config.env" })

connectDB()

const app = express()

// EJS
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars Helpers
// const {
//   formatDate,
//   stripTags,
//   truncate,
//   editIcon,
//   select,
// } = require('./helpers/hbs')

// Static folder
// app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
// app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})