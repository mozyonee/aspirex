module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define('users', {
		name: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		sex: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		number: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		invites: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'Disabled'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		authorized: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		banned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		live: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});

	return users;
};