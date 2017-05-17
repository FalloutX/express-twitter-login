import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import passportTwitter from 'passport-twitter'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
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


/**
 * myRoutes - Adds routes to the Express App.
 *
 * @param  {object} app express app object
 */
function myRoutes (app) {
  app.get('/', (req, res) => {
    console.log(req.user)
    if (req.user) {
      res.json({info: 'successfully-booted-up', user: req.user})
    } else {
      res.json({info: 'successfully-booted-up', login: 'http://127.0.0.1:3001/login/twitter'})
    }
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

/**
 * configureApp - adds configuration and bootstraps express App.
 *
 * @returns {object}  Express App Object
 */
function configureApp () {
  const app = express()
  const db = mongoose.createConnection(config.database.url)
  const MongoStore = connectMongo(session)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.use(session({
    secret: config.express.secret,
    maxAge: 3600 * 1000,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  myRoutes(app)

  return app
}

const app = configureApp()

app.listen(config.server.PORT, () => {
  console.log('Server running at 127.0.0.1:' + config.server.PORT)
})
