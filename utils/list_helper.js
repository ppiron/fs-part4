const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((acc, val) => {
    return acc + val.likes
  }, 0)
}

const favoriteBlog = blogs => {
  const mostLikes = Math.max(...blogs.map(blog => blog.likes))
  const blogWithMostLikes = blogs.filter(blog => blog.likes === mostLikes)[0]
  const { _id, url, __v, ...res } = blogWithMostLikes
  return res
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}