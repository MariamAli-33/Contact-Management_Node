const express = require('express')
const connectDb = require('./config/dbConnection')
const errorHandler = require('./middleware/errorHandler')
const dotenv = require('dotenv').config()

connectDb()
const app = express()

const port = process.env.PORT || 5030

app.use(express.json()) //middleware to help parse the data received from client
app.use('/api/contacts', require('./routes/contactRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use(errorHandler)
// app.use()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
