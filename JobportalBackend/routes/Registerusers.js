const router=require('express').Router();
let Registeruser = require('../models/Registeruser');

router.route("/add").post((req,res)=>{
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const newRegisteruser = new Registeruser({
        userName,
        email,
        password,
        confirmPassword
    });

    newRegisteruser.save()
    .then(()=>res.json('User added!'))
    .catch(err=>res.status(400).json('Error: '+err));
});

router.route("/").get((req,res)=>{
    Registeruser.find()
    .then(registerusers=>res.json(registerusers))
    .catch(err=>res.status(400).json('Error: '+err));
});

router.route("/update/:id").put(async(req,res)=>{
    let userId = req.params.id;
    const {userName,email,password,confirmPassword} = req.body;

    const updateRegisteruser = {
        userName,
        email,
        password,
        confirmPassword 
    };

    const update = await Registeruser.findByIdAndUpdate(userId,updateRegisteruser).then(()=>{
        res.status(200).send({status: "User updated"});
    }).catch(err=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});
    });    
});

router.route("/delete/:id").delete(async(req,res)=>{
    let userId = req.params.id;

    await Registeruser.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "User deleted"});
    }).catch(err=>{
        console.log(err);
        res.status(500).send({status: "Error with deleting data", error: err.message});
    });
});

module.exports = router;    