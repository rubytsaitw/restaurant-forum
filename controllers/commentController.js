const db = require('../models')
const Comment = db.Comment
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(comment => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
        .then(comment => {
          res.redirect(`/restaurants/${comment.RestaurantId}`)
        })
      })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  }
}

module.exports = commentController
