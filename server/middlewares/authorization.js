const { verify } = require('jsonwebtoken');

const validate = (req, res, next) => {
	const sID = req.header('sID');
	if (!sID) return res.status(403);
 
	try {
		const user = verify(sID, 'salt');
		if (!user) return res.status(401);
		req.user = user;
		next();
	} catch (error) {
		res.status(500);
	}
};

module.exports = { validate }