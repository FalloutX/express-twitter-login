import passportHTTPBearer from 'passport-http-bearer'
import User from './models/User'

const strategy = new passportHTTPBearer.Strategy(
  (token, done) => {
    User.findOne({ accessToken: token }, (err, user) => {
      console.log('user =>', user)
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }

      return done(null, user, { scope: 'all' })
    })
  }
)

export default strategy
