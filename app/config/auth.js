'use strict';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtPassport } from 'passport-jwt';
import config from './config';
/* Jwt strategy */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

const jwtStrategy = new JwtPassport(jwtOptions, async (payload, done) => {
  try {
    return payload.id ? done(null, payload) : done(null, false);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(jwtStrategy);
export const jwtAuth = passport.authenticate('jwt', { session: false });
