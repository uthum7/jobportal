const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let Registeruser = require('../models/Registeruser');

router.route("/add").post(async (req, res) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Check if user already exists
    const existingUser = await Registeruser.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);

    //create new user
    const newRegisteruser = new Registeruser({
        userName,
        email,
        password: hashedPassword,
        confirmPassword
    });

    newRegisteruser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route("/").get((req, res) => {
    Registeruser.find()
        .then(registerusers => res.json(registerusers))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/update/:id").put(async (req, res) => {
    let userId = req.params.id;
    const { userName, email, password, confirmPassword } = req.body;

    const updateRegisteruser = {
        userName,
        email,
        password,
        confirmPassword
    };

    const update = await Registeruser.findByIdAndUpdate(userId, updateRegisteruser).then(() => {
        res.status(200).send({ status: "User updated" });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ status: "Error with updating data", error: err.message });
    });
});

router.route("/delete/:id").delete(async (req, res) => {
    let userId = req.params.id;

    await Registeruser.findByIdAndDelete(userId).then(() => {
        res.status(200).send({ status: "User deleted" });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ status: "Error with deleting data", error: err.message });
    });
});

module.exports = router;    