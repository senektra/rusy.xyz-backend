import User from '../../models/user.js'
import bcrypt from 'bcrypt'
import config from '../../utils/config.js'

const usersToAdd = [
  {
    username: config.webmaster.username,
    password: config.webmaster.password,
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const addTestUsers = async () => {
  const users = usersToAdd.map((user) => {
    const passwordHash = bcrypt.hashSync(user.password, 10)
    return new User({ username: user.username, passwordHash })
  })

  await User.insertMany(users)
}

const deleteAll = async () => {
  await User.deleteMany({})
}

export default { usersInDb, deleteAll, addTestUsers, usersToAdd }
