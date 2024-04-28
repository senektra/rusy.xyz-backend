import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { userError } from './errors.js'
import User from '../models/user.js'

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
}

const needed = async (req, _res, next) => {
  const authHeader = req.get('authorization')
  const [scheme, token] = !authHeader ? [null, null] : authHeader.split(' ')

  if (scheme !== 'Bearer' || token === null) throw userError.userNotAuthorized

  const user = jwt.verify(token, process.env.TOKEN_SECRET)
  req.user = await User.findById(user.id)
  next()
}

export default {
  generateAccessToken,
  needed,
}
