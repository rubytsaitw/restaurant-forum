const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  },
  // getRestaurants: (req, res) => {
  //   return Restaurant.findAll({
  //     raw: true,
  //     nest: true,
  //     include: [Category]
  //   }).then(restaurants => {
  //     return res.render('admin/restaurants', { restaurants: restaurants })
  //   })
  // },
}

module.exports = categoryController
