const express = require('express');
//here we create a varible which is used Router Function of express. express is framework of node.js
const router = express.Router();
//including user model from /models/User.js,user collection shema
const User = require('../models/User');
//include express-validator packege in our file for validation
const { body, validationResult } = require('express-validator');
//include bcryptjs packege for password sult and papper
const bcrypt = require('bcryptjs')
//include jwt packege in our file
const jwt = require('jsonwebtoken');
//jwt token secret key for varifiying user if the jwt tokem is change by the user 
const JWT_SECRET = "tusharisthebest";
const fetchuser = require('../middleware/fetchuser');



//ROUTE 1:create a user using : POST "/api/auth/createuser" endpoint. no login required
router.post('/createuser', [
    //validation 
    body('name', 'Please Enter Name').isLength({ min: 3 }),
    body('email', 'Please Enter Vaild Email').isEmail(),
    body('password', 'Password Must be More then Five Digit').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    //if there any error then return bad request and the error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    //we wrap this code in try catch because we never know when error occur in our database
    try {
        //check whether the user with this email exits already
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, Error: "Email already exists." })
            success = false;
        }

        //adding salt and papper in password with the help of bcrypt
        //we make it await because it return promises
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //creating user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        //when user login then we send JWT token to user
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;

        //sending toke when user login with username and password
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
})

//ROUTE 2:Authenticate a User :POST "api/auth/login".no login required
router.post('/login', [
    //validation 
    body('email', 'Please Enter Vaild Email').isEmail(),
    body('password', "Password can't be blank").exists(),
], async (req, res) => {
    let success = false;
    //if there any error then return bad request and the error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //destructring email and password from the body of request ,if there is not any error
    const { email, password } = req.body;
    try {
        //finding the user with the email id
        let user = await User.findOne({ email });
        //if the user with email id is not found in database then we throw an error
        if (!user) {
            return res.status(400).json({ Error: "Please Login with Correct Details." });
        }
        //now we compare passwords
        //'password' request body ,'user.password' password of user
        const passwordCompare = await bcrypt.compare(password, user.password);
        //if password dose not match we throw error 
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, Error: "Please Login with Correct Details." });
        }
        //if the password is current then below code will run
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        //sending toke when user login with username and password
        success = true;
        //sending json in response 
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
})


//ROUTE 3: Get Loggedin user using:POST "api/auth/getuser".Login Rrquired
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");//select -password will select all details but not password
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});
 















module.exports = router;
