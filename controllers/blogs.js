import express from 'express'
import Blog from '../models/blog.js'

const router = express.Router();

router.get('/', async (_req, res) => {
  res.json(await Blog.find())
})

export default router