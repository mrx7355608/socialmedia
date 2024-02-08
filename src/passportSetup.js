import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default function passportSetup() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/auth/google/callback",
            },
            function (accessToken, refreshToken, profile, done) {
                console.log(profile);
                done(null, profile);
            }
        )
    );
}
