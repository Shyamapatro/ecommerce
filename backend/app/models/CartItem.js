module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("CartItem", {
		...require("./core")(Sequelize, DataTypes),
		cartId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
			  model: 'Carts',
			  key: 'id'
			},
			onDelete: 'CASCADE'
		  },
		  productId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
			  model: 'Products',
			  key: 'id'
			}
		  },
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		}
	});
};
