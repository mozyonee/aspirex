module.exports = (sequelize, DataTypes) => {
	const preorders = sequelize.define('preorders', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	return preorders;
}