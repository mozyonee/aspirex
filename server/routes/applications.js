const express = require('express');
const router = express.Router();
const { applications, users, preorders } = require('../models');

router.post('/', async (req, res) => {
	const application = req.body;

	const userDB = await users.findOne({ where: { email: application.email } });
	if (!userDB) await users.create(application);
	else await userDB.update({ name: application.name, sex: application.sex });

	await preorders.update({ name: application.name }, { where: { email: application.email } });

	const applicationDB = await applications.findOne({ where: { email: application.email } });
	if (!applicationDB) await applications.create(application);
	else await applications.update({ name: application.name, sex: application.sex }, { where: { email: application.email } });

	res.status(200).send(application);
});

module.exports = router;