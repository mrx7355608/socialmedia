import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "./models/user.model";

export default function passportSetup() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, done) {
                // Check if user has previously logged in with google
                const user = await UserModel({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }
                // Create and save new user in database
                const newUserData = {
                    googleId: profile.id,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: null,
                    password: null,
                    profilePicture: profile.photos[0].value,
                    bio: "",
                    friends: [],
                    pending_requests: [],
                };
                const newUser = await UserModel.create(newUserData);
                return done(null, newUser);
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}
