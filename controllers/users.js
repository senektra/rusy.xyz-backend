import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
// import config from '../utils/config.js'
import { userError } from '../utils/errors.js'
import 'dotenv/config'

const usersRouter = Router()

// Search for users by case insensitive username
const createUserQuery = (username) => ({
  username: { $regex: new RegExp(`${username}`, 'i') },
})

const validateUser = (username, password) => {
  if (!username) throw userError.noUsername
  if (!password) throw userError.noPassword
}

// GET Requests

usersRouter.get('/', async (_req, res) => {
  res.json(await User.find({}))
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.json(user)
  } else {
    throw userError.notFound
  }
})

// POST Requests

usersRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  validateUser(username, password)

  const user = await User.findOne(createUserQuery(username))

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw userError.badLogin
  }

  const token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.TOKEN_SECRET,
  )

  res.status(200).json({ token, username: user.username, name: user.name })
})

export default usersRouter
