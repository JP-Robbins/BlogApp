const dummy = (blogs) => {
  let result = blogs
  result = 1
  return result
}

/**
 * Receives a list of blog posts, and returns the sum of likes of all the posts.
 *
 *
 *
 * @param {Array<object>} posts
 * @return {number}
 */
const totalLikes = (posts) => {
  if (posts.length === 0) {
    return 0
  }
  let likes = 0
  for (let i = 0; i < posts.length; i++) {
    likes += posts[i].likes
  }
  return likes
}

/**
 * Receives a list of blog posts, and returns an object of the top blog post.
 *
 *
 *
 * @param {Array<object>} posts
 * @return {Array<object>} topPost
 */

const favoriteBlog = (posts) => {
  if (posts.length === 0) {
    return 'no posts added.'
  }
  let topPost
  for (let i = 0; i < posts.length; i++) {
    if (topPost === undefined) {
      topPost = posts[i]
    } else if (posts[i].likes > topPost.likes) {
      topPost = posts[i]
    }
  }
  return topPost
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
