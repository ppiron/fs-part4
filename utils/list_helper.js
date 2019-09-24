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

const mostBlogs = blogs => {
  const blogsPerAuthor = blogs.reduce((acc, val) => {
    if (acc[val.author] === undefined) {
      return { ...acc, [val.author]: blogs.filter(blog => blog.author === val.author).length }
    } else {
      return acc
    }
  }, {})
  return {
    author: Object.keys(blogsPerAuthor).filter(author => blogsPerAuthor[author] === Math.max(...Object.values(blogsPerAuthor)))[0],
    blogs: Math.max(...Object.values(blogsPerAuthor))
  }
}

const mostLikes = blogs => {
  const likesPerAuthor = blogs.reduce((acc, val) => {
    if (acc[val.author] === undefined) {
      return {
        ...acc, [val.author]: blogs.filter(blog => blog.author === val.author).reduce((acc, val) => {
          return acc + val.likes
        }, 0)
      }
    } else {
      return acc
    }
  }, {})
  return {
    author: Object.keys(likesPerAuthor).filter(author => likesPerAuthor[author] === Math.max(...Object.values(likesPerAuthor)))[0],
    likes: Math.max(...Object.values(likesPerAuthor))
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}