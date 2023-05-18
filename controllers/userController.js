const asyncHandler = require("express-async-handler")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// @desc Register user
// @route POST api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const {username, email, password} = req.body
  if (!username || !email || !password) {
    res.status(400)
    throw new Error('All fields are mendatory')
  }
  const userAvailable = await User.findOne({ email })
  if (userAvailable) {
    res.status(400)
    throw new Error('User already registered')
  }
  //hash passowrd
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  })
  if (user) {
    res.status(200).json({_id: user.id, email: user.email})
  }
  else {
    res.status(400)
    throw new Error('User data is not valid')
  }
})

// @desc Login user
// @route GET api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }
  const user = await User.findOne({ email })
  //compare password with hashed password
  if (user && bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ //jwt has three parts, header(type), payload(data), secret
      user: {
        username: user.username,
        email: user.email,
        id: user.id
      }
    },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '10m'}//expiartion date of token
    )
    res.status(200).json({accessToken})
  }
  else {
    res.status(401)
    throw new Error ('Email or password is not valid')
  }
  res.status(200).json({ message: 'Login User' })
})

// @desc GET Current User
// @route GET api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})


module.exports = { registerUser, loginUser, currentUser}
