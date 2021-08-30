const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              category: category.toJSON(),
              categories: categories
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
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
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Please enter category name.')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
        .then(category => {
          return res.redirect('/admin/categories')
        })
      })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  },
}

module.exports = categoryController
