module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("User", {
		...require("./core")(Sequelize, DataTypes),
		firstName: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		password: {
			type: DataTypes.STRING(100),
			field: "password"
		},
		
	});
};