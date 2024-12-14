module.exports = (sequelize, DataTypes) => {
	const links = sequelize.define('links', {
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	return links;
}