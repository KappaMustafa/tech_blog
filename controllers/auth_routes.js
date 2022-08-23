const auth_router = require('express').Router();
const User = require('../models/User');
const { isLoggedIn } = require('./helpers');


auth_router.post('/register', isLoggedIn, (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    req.session.errors = ['Email and passowrd do not match.'];
    return res.redirect('/register');
  }
  User.findOne({
    where: {
      email
    }
  }).then(user => {

    if (user) {
      req.session.errors = ['Username must not be taken.'];
      return res.redirect('/register');
    }

    User.create(req.body)
      .then(new_user => {
        req.session.save(() => {
          req.session.user_id = new_user.id;
          res.redirect('/');
        });
      }).catch(err => {
        console.log(err);
        req.session.errors = err.errors.map(e => e.message);
        res.redirect('/register');
      });
  });
});


auth_router.post('/login', isLoggedIn, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.session.errors = ['Email and passowrd do not match.'];
    return res.redirect('/login');
  }

  User.findOne({
    where: {
      email
    }
  }).then(async user => {
    if (!user) {
      req.session.errors = ['User account does not match our records.'];
      return res.redirect('/login');
    }

    const pass_is_valid = await user.validatePassword(password, user.password);


    if (!pass_is_valid) {
      req.session.errors = ['Password is incorrect'];
      res.redirect('/login');
    }
    req.session.save(() => {
      req.session.user_id = user.id;
      res.redirect('/');
    });
  })
});

auth_router.get('/logout', (req, res) => {
  if (!req.session.user_id) return res.redirect('/');
  req.session.destroy(() => {
    res.redirect('/');
  });
})

module.exports = auth_router;