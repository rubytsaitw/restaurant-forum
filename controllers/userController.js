const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
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
    const reqUser = helpers.getUser(req)
    const restaurants = helpers.getUser(req).FavoritedRestaurants
    const FavoriteRestCount = helpers.getUser(req).FavoritedRestaurants.length
    const followers = reqUser.Followers
    const FollowerCount = reqUser.Followers.length
    const followings = reqUser.Followings
    const FollowingCount = reqUser.Followings.length

    return User.findByPk(userId)
      .then(user => {
        Comment.findAndCountAll({
          include: [Restaurant],
          where: { userId: userId }
        })
          .then(comments => {
            const commentData = comments.rows.map(comment => ({
              ...comment,
              restaurantId: comment.Restaurant.id,
              restaurantImage: comment.Restaurant.image
            }))
            const CommentCount = comments.count
            res.render('profile', {
              user: user.toJSON(),
              restaurants, FavoriteRestCount,
              followers, FollowerCount,
              followings, FollowingCount,
              comments: commentData, CommentCount
            })
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
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
  },
  unlike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        like.destroy()
          .then(restaurant => {
            return res.redirect('back')
          })
      })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
