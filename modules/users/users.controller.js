const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('./../../_middleware/validate-request');
const authorize = require('./../../_middleware/user');
const userService = require('./users.service');
let multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
// routes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/user");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.toLowerCase().split(' ').join('-'));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          return cb('Only .png, .jpg and .jpeg format allowed!', false);
        }
    }
});

const cpUpload = upload.single('image');
function uploadImage(req, res, next) {
    cpUpload(req, res, function(err){
        if (!fs.existsSync("user")){
            fs.mkdirSync("user");
        }
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: JSON.stringify(err) });
        } else if (err) {
            return res.status(400).json({ message: err });
        }
        next();
    });
}
router.post('/authenticate', authenticateSchema, authenticate); // No user
router.post('/register', uploadImage, register); // No User
router.get('/', getAllSchema, getAll); // By Super Admin Only
router.get('/current', authorize.user(), getCurrent); // User level
router.post('/change-password', authorize.user(), changePassword); // By Super Admin Only
router.get('/:id', getById); // By Super Admin Only
router.put('/:id', authorize.user(), uploadImage,update); // By Super Admin Only


//Google Logins

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
        firebaseToken: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(data => res.json({ message: "Success", data }))
        .catch(next);
}

function changePassword(req, res, next) {
    
    userService.changePassword(req.user,req.body)
        .then(data => {
            /*
            * Send Mail
            */
            res.json({ message: "Success", data })
        })
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNo: Joi.string().required(),
        dob: Joi.string().required(),
        gender: Joi.string().required(),
        aadharNumber: Joi.string().required(),
        address: Joi.string().required(),
        lat: Joi.string().empty(''),
        long: Joi.string().empty(''),
        password: Joi.string().required(),
        firebaseToken: Joi.string().empty(''),
        deviceId: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/user/${req.file.filename}`;
    }
    userService.create(req.body)
        .then(data => {
            res.json({ message: 'Success', data })
        })
        .catch(next);
}

function getAllSchema(req, res, next){
    const schema = Joi.object({
        offset: Joi.number().integer().min(0).empty(''),
        limit: Joi.number().integer().min(1).empty(''),
        orderBy: Joi.string().valid('id', 'createdAt', 'name', 'email').empty(''),
        orderType: Joi.string().valid('DESC', 'ASC').empty('')
    });
    validateRequest(req, next, schema, 'query');
}

function getAll(req, res, next) {
    userService.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}

function getCurrent(req, res, next) {
    userService.getCurrent(req.user)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
    // const token = jwt.sign({ sub: req.user.id }, process.env.SECRETSTRING, { expiresIn: '7d' });
    // req.user.token = token;
    // res.json({ message: 'Success', data: req.user, check: "User Current" });
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function update(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/user/${req.file.filename}`;
    } 
    userService.update(req.user,req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}


