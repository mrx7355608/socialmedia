const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: LocalStrategy } = require("passport-local");
const UserModel = require("./models/user.model");
const validator = require("validator");
const { verifyString } = require("./utils/hashAndVerify");

function passportSetup() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/v1/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, done) {
                // Check if user has previously logged in with google
                const user = await UserModel.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }
                // Create and save new user in database
                const newUserData = {
                    googleId: profile.id,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    email: profile.emails[0].value,
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

    passport.use(
        new LocalStrategy({ usernameField: "email" }, async function (
            email,
            password,
            done
        ) {
            if (validator.isEmail(email) === false) {
                return done(null, false, {
                    message: "Invalid email",
                });
            }
            // Check if user exists
            const user = await UserModel.findOne({ email });
            if (user == null) {
                return done(null, false, {
                    message: "Incorrect email or password",
                });
            }

            // Validate password
            const isValidPassword = await verifyString(password, user.password);
            if (isValidPassword === false) {
                return done(null, false, {
                    message: "Incorrect email or password",
                });
            }

            return done(null, user);
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = passportSetup;
