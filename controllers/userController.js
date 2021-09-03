const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const helpers = require('../_helpers')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'c413a982ea63ad2'

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'Inconsistent password!')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'This email is already registered')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'Registration successful')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', 'Login successful')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_message', 'Logout successful')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    const userId = req.params.id
    User.findByPk(userId)
      .then(user => {
        Comment.findAndCountAll({
          include: [Restaurant],
          where: { userId: userId }
        })
          .then(results => {
            const data = results.rows.map(comment => ({
              ...comment,
              restaurantId: comment.Restaurant.id,
              restaurantImage: comment.Restaurant.image
            }))
            const count = results.count
            res.render('profile', { user: user.toJSON(), comments: data, count })
          })
      })
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (helpers.getUser(req).id !== Number(req.params.id)) {
          req.flash('error_messages', "Cannot edit other's profile.")
          return res.redirect('back')
        }
        res.render('editProfile', { user: user.toJSON() })
      })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    // if image uploaded
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              avatar: file ? img.data.link : user.avatar
            })
              .then((user) => {
                req.flash('success_messages', `User image (${img.data.link}) was successfully updated.`)
                res.redirect(`/users/${user.id}`)
              })
          })
      })
    }
    // no image uploaded, only name field
    else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            avatar: user.avatar
          })
            .then((user) => {
              req.flash('success_messages', 'User name was successfully updated.')
              res.redirect(`/users/${user.id}`)
            })
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        favorite.destroy()
        .then(restaurant => {
          return res.redirect('back')
        })
      })
  }
}

module.exports = userController
