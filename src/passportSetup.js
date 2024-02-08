import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default function passportSetup() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/auth/google/callback",
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, profile);
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
