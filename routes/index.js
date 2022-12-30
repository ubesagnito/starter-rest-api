var router = require('express').Router();
router.use('/admin', require('./../modules/admin/admin.controller'));
router.use('/user', require('./../modules/users/users.controller'));
router.use('/currency', require('./../modules/currency/currency.controller'));
router.use('/gameinfo', require('./../modules/gameinfo/gameinfo.controller'));
router.use('/gamephase', require('./../modules/gamephase/gamephase.controller'));
router.use('/timezone', require('./../modules/timezone/timezone.controller'));
router.use('/scratchcard', require('./../modules/scratchcard/scratchcard.controller'));




module.exports = router;