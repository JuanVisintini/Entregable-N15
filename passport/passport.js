const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserMongo = require('../daos/userMongo');


const registerStrategy = new LocalStrategy(
    { passReqToCallback : true },
    async (req, username, password, done) => {
            const user = await UserMongo.findOne({ "email": username });
            if(user) {
                return done(null, false, { message: 'El usuario ya existe' });
            }
            const newUser = new UserMongo({
                "email": username,
                password: password
            });
            await newUser.save();
            done(null, newUser)});  

const loginStrategy = new LocalStrategy(
    { passReqToCallback : true },
    async (req, username, password, done) => {
            const user = await UserMongo.findOne({ "email": username });
            // console.log(password)
            // console.log(user.password)
            console.log(bcrypt.compareSync(password, user.password))
            if(!user || !await bcrypt.compareSync(password, user.password)) 
            
                return done(null, null);
            done(null, user);
    }
);

passport.use('register', registerStrategy);
passport.use('login', loginStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
}),

passport.deserializeUser((id, done) => {
    UserMongo.findById(id, done);
}),


module.exports = passport;
