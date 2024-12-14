module.exports = (sequelize, DataTypes) => {
	const applications = sequelize.define('applications', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sex: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	return applications;
}