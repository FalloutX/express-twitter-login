import express from 'express'
import User from '../models/User'
import passport from 'passport'
const router = express.Router()

router.get('/users',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.json({info: 'some error occured while fetching all the users'})
      }
      res.json(users)
    })
  }
)

export default router
