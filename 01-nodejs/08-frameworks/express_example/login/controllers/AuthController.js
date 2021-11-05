const bcrypt = require("bcryptjs");
const User = require("../models/User"); // User model

//const { registerSchema, loginSchema } = require('../utils/userValidations');
exports.isAuth = (req,res,next) => {
    const sessUser = req.session.user;
    if (sessUser) {
        next();
    }
    else {
        err = res.status(401).json("You Need to Be Logged in to do this. Access Denied ")
        return err;
    }
};

exports.registerUser = (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    //const result = registerSchema.validate({ name, email, password});
    const result = { error: false };
    if(!result.error) {
        // Check for existing user
        User.findOne({ email: email }).then((user) => {
            if (user) return res.status(400).json("User already exists");
            //New User created
            const newUser = new User({
                name,
                email,
                password
            });
            //Password hashing
            bcrypt.genSalt(12, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // Save user
                    newUser
                        .save()
                        .then(
                            res.json("Successfully Registered")
                        )
                        .catch((err) => console.log(err));
                })
            );
        });
    } else {
        res.status(422).json(result.error.details[0].message);
    }
};

exports.unregisterUser = (req, res) => {

};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // basic validation
    //const result = loginSchema.validate({ email, password});
    const result = { error: false };
    if (!result.error) {
        //check for existing user
        User.findOne({ email }).then((user) => {
            if (!user) return res.status(400).json("Incorrect Email or Password");
            console.log("find user", user);
            // Validate password
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (!isMatch) return res.status(400).json("Incorrect Email or Password");

                const sessUser = { id: user.id, name: user.name, email: user.email };
                console.log('sessUser', sessUser)
                //req.session.user = sessUser; // Auto saves session data in mongo store
                //res.json(sessUser); // sends cookie with sessionID automatically in response
                res.render('users', { sessUser: sessUser });
            });
        });
    } else {
        console.log(result.error)
        res.status(422).json(result.error.details[0].message);
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        // delete session data from store, using sessionID in cookie
        if (err) throw err;
        res.clearCookie("session-id"); // clears cookie containing expired sessionID
        res.send("Logged out successfully");
    });
};

exports.authChecker = (req, res) => {
    const sessUser = req.session.user;
    if (sessUser) {
        return res.json(sessUser);
    } else {
        return res.status(401).json({ msg: "Unauthorized" });
    }
};