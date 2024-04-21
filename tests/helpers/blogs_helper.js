import Blog from '../../models/blog.js';

const getDateTwoDaysLater = (date) => {
  const twoDaysLater = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
  return twoDaysLater;
}

const mockedBlogs = [
  {
    title: 'Blog 1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date(),
    updatedAt: new Date(getDateTwoDaysLater(new Date())),
  },
  {
    title: 'Blog 2',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date(),
    updatedAt: new Date(getDateTwoDaysLater(new Date())),
  },
]

const getMockedBlogsFromDb = async () => {
  await Blog.find({});
}

const getMockedBlogById = async (id) => {
  await Blog.findById(id)
}

const insertMockBlogs = async () => {
  await Blog.insertMany(mockedBlogs)
}

const deleteMockBlogs = async () => {
  await Blog.deleteMany({})
}

export default {
  getMockedBlogsFromDb,
  insertMockBlogs,
  deleteMockBlogs
}