const User = require('../models/user.models');
// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
// uuid
// uuid generates random but unique 16 digit id
const { v4: uuidv4 } = require('uuid');

// twilio for otp sending
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// redis
const redisClient = require('../../dbConnect/redisConnect')

// function that sends the messages to people
const sendMsg = async (otp, username, toPhone) => {
    // await client.messages
    //     .create({ body: `Hey ${username}.\nYour OTP is ${otp}`, from: '+12406982773', to: toPhone })
    //     .then(message => {
    //         console.log(message.status);
    //         console.log(message.error_code);
    //         console.log(message.error_message);
    //     });
    console.log("message sent")
};

exports.insert = (req, res) => {
    User.find({ phone: req.body.phone }).exec(async (err, docs) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "server error" });
            return;
        }
        else {
            try {
                if (docs.length == 0) {
                    const newUser = new User({
                        email: req.body.email,
                        username: req.body.username,
                        phone: req.body.phone,
                    });

                    await newUser.save();

                    User.find({ email: req.body.email }).exec(async (err, docs) => {
                        if (err) {
                            console.log(err);
                            res.status(400).json({ message: "server error" });
                            return;
                        }
                        else {
                            const OTP = Math.floor(100000 + Math.random() * 900000);

                            // comment this in prod server
                            console.log(OTP);

                            await redisClient.connect();
                            await redisClient.set(String(req.body.phone), OTP);
                            await redisClient.quit();

                            try {
                                sendMsg(OTP, req.body.username, req.body.phone);
                            }
                            catch {
                                User.deleteOne({ "email": req.body.email }).exec((err, docs) => {
                                    res.status(400).json({ message: "server error" });
                                    return;
                                });
                            }

                            const userData = {
                                "_id": docs[0]._id.toString(),
                                "email": docs[0].email,
                                "username": docs[0].username,
                                "phone": docs[0].phone,
                            }

                            res.status(200).json(userData);
                            return;
                        }
                    });
                }
                else {
                    res.status(409).json({ message: "email exists" });
                    return;
                }
            }
            catch {
                res.status(400).json({ message: "server error" });
                return;
            }
        }
    });
};

exports.verify = async (req, res) => {
    try {
        await redisClient.connect();
        const otp = await redisClient.get(req.body.phone);
        if (otp == null) {
            await redisClient.quit();
            res.status(403).json({ message: "Unauthorized access" });
            return;
        }
        else if (otp == req.body.otp) {
            await redisClient.quit();
            res.status(200).json({ message: "OTP correct" });
            return;
        }
        else {
            await redisClient.quit();
            res.status(403).json({ message: "Unauthorized access" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "server error" });
        return;
    }
}

exports.login = async (req, res) => {
    User.find({ phone: req.body.phone }).exec(async (err, docs) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "server error" });
            return;
        }
        else {
            try {
                if (docs.length == 0) {
                    res.status(409).json({ message: "user missing" });
                    return;
                }
                else {
                    const OTP = Math.floor(100000 + Math.random() * 900000);

                    // comment this in prod server
                    console.log(OTP);

                    await redisClient.connect();
                    await redisClient.set(String(req.body.phone), OTP);
                    await redisClient.quit();

                    try {
                        sendMsg(OTP, req.body.username, req.body.phone);
                    }
                    catch {
                        User.deleteOne({ "email": req.body.email }).exec((err, docs) => {
                            res.status(400).json({ message: "server error" });
                            return;
                        });
                    }

                    const userData = {
                        "_id": docs[0]._id.toString(),
                        "email": docs[0].email,
                        "username": docs[0].username,
                        "phone": docs[0].phone,
                    }

                    res.status(200).json(userData);
                    return;
                }
            }

            catch (error) {
                console.log(error);
                res.status(400).json({ message: "server error" });
                return;
            }
        }
    });
}