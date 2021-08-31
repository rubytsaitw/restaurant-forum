const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
  getProfile: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.render('profile', { user: user.toJSON() })
      })
  }
}

module.exports = userController
