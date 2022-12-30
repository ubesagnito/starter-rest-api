const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const scratchCardService = require('./scratchcard.service');
const dotenv = require('dotenv');
let multer = require('multer');
const fs = require('fs');
dotenv.config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/scratchcard");
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
        if (!fs.existsSync("scratchcard")){
            fs.mkdirSync("scratchcard");
        }
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: JSON.stringify(err) });
        } else if (err) {
            return res.status(400).json({ message: err });
        }
        next();
    });
}
// routes
router.get('/', getAllSchema, getAll); 
router.post('/store',uploadImage,storeSchema,store); 
router.get('/:id', getById);
router.put('/:id', uploadImage, storeSchema, update); 
router.delete('/:id', _delete);
module.exports = router;
// currency section
function getAllSchema(req, res, next){
    const schema = Joi.object({
        offset: Joi.number().integer().min(0).empty(''),
        limit: Joi.number().integer().min(1).empty(''),
        orderBy: Joi.string().valid('id', 'createdAt', 'name').empty(''),
        orderType: Joi.string().valid('DESC', 'ASC').empty(''),
        search: Joi.string().empty(''),
    });
    validateRequest(req, next, schema, 'query');
}
function getAll(req, res, next) {
    scratchCardService.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}

function store(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/scratchcard/${req.file.filename}`;
    }
    scratchCardService.create(req.body).then(data => { res.json({ message: 'Success', data })}).catch(next);
}
function storeSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.string().required(),
        duration: Joi.string().required(),
        topPrize: Joi.string().required(),
        features: Joi.string().empty(''),
        options: Joi.string().empty(''),
        frequency: Joi.string().empty(''),
        unmatchedMessage: Joi.string().empty(''),
        playsOption: Joi.string().required(),
        rangeFrom: Joi.string().empty(''),
        rangeTo: Joi.string().empty(''),
        status: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function getById(req, res, next) {
    scratchCardService.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
function update(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/scratchcard/${req.file.filename}`;
    }
    scratchCardService.update(req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function _delete(req, res, next) {
    scratchCardService._delete(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
