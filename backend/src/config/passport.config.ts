import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService } from "../services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (_req: Request, _accessToken, _refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        
        if (!googleId) {
          return done(new Error("Google ID (sub) is missing"), false);
        }

        if (!email) {
          return done(new Error("Email is missing from Google profile"), false);
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });

        if (!user) {
          return done(new Error("Failed to create or find user"), false);
        }

        // Return the user directly - we'll populate in the callback
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Minimal serialization for Google OAuth - we don't store sessions but Passport needs these
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id).populate('currentWorkspace');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;