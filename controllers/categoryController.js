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
  postCategories: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Please enter category name.')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name,
      }).then(category => {
        req.flash('success_messages', 'Category was successfully created.')
        return res.redirect('/admin/categories')
      })
    }
  }


  // postRestaurant: (req, res) => {
  //   if (!req.body.name) {
  //     req.flash('error_messages', "name didn't exist")
  //     return res.redirect('back')
  //   }
  //   const { file } = req
  //   if (file) {
  //     imgur.setClientID(IMGUR_CLIENT_ID);
  //     imgur.upload(file.path, (err, img) => {
  //       return Restaurant.create({
  //         name: req.body.name,
  //         tel: req.body.tel,
  //         address: req.body.address,
  //         opening_hours: req.body.opening_hours,
  //         description: req.body.description,
  //         image: file ? img.data.link : null,
  //         CategoryId: req.body.categoryId
  //       }).then((restaurant) => {
  //         req.flash('success_messages', 'restaurant was successfully created')
  //         return res.redirect('/admin/restaurants')
  //       })
  //     })
  //   }
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
