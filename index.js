import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import passportTwitter from 'passport-twitter'
import session from 'express-session'
import config from './config'


passport.use(new passportTwitter.Strategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
}, (token, tokenSecret, profile, cb) => {
  console.log('Authentication Successful => ', token, tokenSecret, profile)
  return cb(null, profile)
}))

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((obj, cb) => {
  cb(null, obj)
})


function myRoutes (app) {
  app.get('/', (req, res) => {
    res.json({info: 'successfully-booted-up', user: req.user})
  })

  app.get('/login/twitter',
    passport.authenticate('twitter')
  )

  app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/')
    })
}


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({
  secret: config.express.secret,
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

myRoutes(app)

app.listen(config.server.PORT, () => {
  console.log('Server running at 127.0.0.1:' + config.server.PORT)
})
