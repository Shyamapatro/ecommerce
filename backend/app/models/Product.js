module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("Product", {
		...require("./core")(Sequelize, DataTypes),
		name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        category:{
            type: Sequelize.TEXT,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
		
	});
};