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
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });

        // Populate the user with currentWorkspace before returning
        const populatedUser = await UserModel.findById(user._id).populate('currentWorkspace');
        
        done(null, populatedUser || user);
      } catch (error) {
        done(error, false);
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