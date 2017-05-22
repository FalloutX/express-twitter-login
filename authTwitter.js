import config from './config'
import passportTwitter from 'passport-twitter'
import User from './models/User'


const authTwitter = new passportTwitter.Strategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
}, (token, tokenSecret, profile, cb) => {
  console.log('Authentication Successful => ', token, tokenSecret)
  User.findById(profile._json.screen_name, function (err, user) {
    if (err) {
      console.log(err)
      return cb(err)
    }
    if (user) {
      user.accessToken = token
      user.accessTokenSecret = tokenSecret
      user.followers = profile._json.followers_count
      user.following = profile._json.friends_count
      user.photo = profile._json.profile_image_url
      user.displayName = profile._json.name
      user.save(function (err) {
        if (err) {
          console.log('Error occuring while updating user', err)
        } else {
          console.log('User successfully updated')
        }
        return cb(null, user)
      })
    } else {
      let newUser = new User({
        _id: profile._json.screen_name,
        accessToken: token,
        accessTokenSecret: tokenSecret,
        followers: profile._json.followers_count,
        following: profile._json.friends_count,
        photo: profile._json.profile_image_url,
        displayName: profile._json.name
      })
      newUser.save(function (err) {
        if (err) {
          console.log('Error occuring while adding new user', err)
        } else {
          console.log('User successfully added to DB')
        }
        return cb(null, newUser)
      })
    }
  })
})

export default authTwitter
