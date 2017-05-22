import express from 'express'
import passport from 'passport'

import jwt from 'jsonwebtoken'

function generateToken (req, res, next) {
  req.token = jwt.sign({
    id: req.user.id
  }, 'server secret')
  next()
}

const router = express.Router()


router.get('/twitter',
  passport.authenticate('twitter', {
    session: false
  })
)

router.get('/guess/user', generateToken, (req, res) => {
  if (req.user) {
    res.json({info: 'successfully-booted-up', user: req.user, token: req.token})
  } else {
    res.json({info: 'successfully-booted-up', login: 'http://127.0.0.1:3001/login/twitter'})
  }
})

router.get('/twitter/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/login/guess/user')
  })


export default router
