const view_router = require('express').Router();
const { isLoggedIn } = require('./helpers');
const User = require('../models/User');

view_router.get('/', isLoggedIn, (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    return User.findOne({
      where: {id: user_id},
      attributes: ['id', 'email', 'username']
    })
        .then(user => {
          user = {username: user.username,email: user.email};
          res.render('index', {user});
        });
  }
  res.render('index');
});

view_router.get('/login', isLoggedIn, (req, res) => {
  res.render('login', {errors: req.session.errors});
});

view_router.get('/register', isLoggedIn, (req, res) => {
  res.render('register', {errors: req.session.errors});
});

view_router.get('/posts', isLoggedIn, (req, res) => {
  const user_id = req.session.userId
  if(user_id) {
      return User.findOne({
          where: {id: user_id},
          attributes: ['id','email','username'],
        })
            .then(user => {
              user = {username: user.username,email: user.email}
              res.render('posts', {user})
          });
    }
    res.render('posts')
});
module.exports = view_router;