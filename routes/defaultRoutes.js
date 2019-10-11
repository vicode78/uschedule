const express = require('express')
const router =express.Router()
const defaultController = require('../controllers/defaultController')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Admin = require('../models/admin')
const bcrypt = require("bcryptjs");
const  auth = require('../config/customFunction')
const isUser = auth.isUser



router.route('/')
    .get(defaultController.index)

router.route('/contact')
    .get(defaultController.contactGet)
    .post(defaultController.contactPost)

router.route('/department')
    .get(defaultController.departmentGet)

router.route('/about')
    .get(defaultController.aboutGet)

router.route('/login')
    .get(defaultController.loginGet)


//======================defining the strategy to be used by the user==================
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    Patient.findOne({ email: email }).then(user => {
        if (!user) {
            Hospital.findOne({ email: email }).then(user => {
                if (!user) {
                    Admin.findOne({ email: email }).then(user => {

                        if (!user) {
                            return done(null, false, req.flash('error', 'user not found with this email.'));
                        }

                        bcrypt.compare(password, user.password, (err, passwordMatched) => {
                            if (err) {
                                return err;
                            }

                            if (!passwordMatched) {
                                return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
                            }

                            return done(null, user, req.flash('success', 'Login Successful'));
                        });

                    })

                }


                bcrypt.compare(password, user.password, (err, passwordMatched) => {
                    if (err) {
                        return err;
                    }

                    if (!passwordMatched) {
                        return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
                    }

                    return done(null, user, req.flash('success', 'Login Successful'));
                });
            });
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }

            if (!passwordMatched) {
                return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
            }

            return done(null, user, req.flash('success', 'Login Successful'));
        });
    });
}));



//determines which data of the user object should be stored in the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Patient.findById(id, function (err, user) {
        if (!user) {
            Hospital.findById(id, function (err, user) {
                if (!user) {
                    Admin.findById(id, function (err, user) {
                        done(err, user);
                    })
                } else {
                    done(err, user);
                }
            });
        } else {
            done(err, user);
        }
    });

});


router.route('/login')
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }), defaultController.loginPost);



router.route('/profile')
    .get(isUser,defaultController.profileGet)


    
router.route('/logout')
    .get(defaultController.logoutGet)


module.exports = router