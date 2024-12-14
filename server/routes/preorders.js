const express = require('express');
const router = express.Router();
const { preorders, users, applications } = require('../models');

router.post('/', async (req, res) => {
	const order = req.body;

	const userDB = await users.findOne({ where: { email: order.email } });
	if (userDB) await userDB.update({ name: order.name, country: order.country });
	else await users.create(order); 
	
	const application = await applications.findOne({ where: { email: order.email } });
	if (application) await applications.update({ name: order.name }, { where: { email: order.email } });

	const preorderDB = await preorders.findOne({ where: { email: order.email } });
	if (preorderDB) await preorders.update({ name: order.name, country: order.country }, { where: { email: order.email } });
	if (preorderDB.model !== order.model) await preorders.create(order);

	res.status(200).send(order);
});

module.exports = router;