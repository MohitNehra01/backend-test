
const express = require('express');
const {newMessage ,getMessage } = require('../controlers/messageControler')
const router = express.Router();

router.post('/add', newMessage);
router.post('/get/:id',getMessage)

module.exports = router