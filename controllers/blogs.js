import express from 'express'
import auth from '../utils/auth.js'
import Blog from '../models/blog.js'

const router = express.Router()

// GET requests

router.get('/', async (_req, res) => {
  res.json(await Blog.find())
})

// POST requests

router.post('/', auth.needed, async (req, res) => {
  const blog = new Blog(req.body)
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

export default router
