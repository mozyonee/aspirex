require('dotenv').config();
const express = require('express');
const router = express.Router();
const { links, users, orders } = require('../models');
const { sendMail } = require('../helpers/mail');
const crypto = require('crypto');
const { sign } = require('jsonwebtoken');
const { validate } = require('../middlewares/authorization');
const sequelize = require('sequelize');

router.post('/bot', (req, res) => {
	const data = req.body;

	const socketID = data.socket;
	const message = {
		author: {
			type: 'agent',
			name: data.name
		},
		text: data.message
	};

	io.to(socketID).emit('receiveTelegram', message);
	res.send({ message: 'POST request received successfully!' });
});

module.exports = router;