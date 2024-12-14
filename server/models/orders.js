module.exports = (sequelize, DataTypes) => {
	const orders = sequelize.define('orders', {
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		headset: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'setting'
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		invoice: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		}
	});

	return orders;
};