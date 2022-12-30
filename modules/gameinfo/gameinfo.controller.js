const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const authorize = require('../../_middleware/user');
const modelSerice = require('./gameinfo.service');
let multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
// routes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/lottery");
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
        if (!fs.existsSync("lottery")){
            fs.mkdirSync("lottery");
        }
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: JSON.stringify(err) });
        } else if (err) {
            return res.status(400).json({ message: err });
        }
        next();
    });
}
 
router.post('/store',authorize.admin(), storeSchema, uploadImage, store); 
router.get('/', getAllSchema, getAll); 
router.get('/:id', getById); 
router.put('/:id', authorize.admin(),storeSchema, uploadImage,update); 
router.delete('/:id',authorize.admin(), _delete);

module.exports = router;
function storeSchema(req, res, next) {
    const schema = Joi.object({
        gameCurrency: Joi.string().empty(''),
        gameNumber: Joi.string().empty(''),
        gameName: Joi.string().empty(''),
        gameSlogan: Joi.string().empty(''),
        gameDuration: Joi.string().empty(''),
        maxNumberTickets: Joi.string().empty(''),
        ticketPrice: Joi.string().empty(''),
        minPrizePool: Joi.string().empty(''),
        startTime: Joi.string().empty(''),
        timeZone: Joi.string().empty(''),
        status: Joi.number().integer().empty(''),
        instruction: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function store(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/lottery/${req.file.filename}`;
    }
    modelSerice.create(req.user,req.body)
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
        orderType: Joi.string().valid('DESC', 'ASC').empty(''),
        search: Joi.string().empty(''),
    });
    validateRequest(req, next, schema, 'query');
}

function getAll(req, res, next) {
     
    modelSerice.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}

function getById(req, res, next) {
    modelSerice.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function update(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/lottery/${req.file.filename}`;
    } 
    modelSerice.update(req.user,req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function _delete(req, res, next) {
    modelSerice.delete(req.user,req.params.id)
        .then(() => res.json({ message: 'Success' }))
        .catch(next);
}

