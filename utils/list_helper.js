const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((acc, val) => {
    return acc + val.likes
  }, 0)
}

module.exports = {
  dummy,
  totalLikes
}