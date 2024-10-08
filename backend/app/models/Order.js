
module.exports = function (Sequelize, sequelize, DataTypes) {
  return sequelize.define("Order", {
    ...require("./core")(Sequelize, DataTypes),
		userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: 'Users',
              key: 'id'
          }
      },
      totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
      },
      status: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'Pending',
      },
      shippingAddress: {
        type: DataTypes.JSON, 
        allowNull: false
      },
      paymentMethod:{
        type: DataTypes.STRING(50),
        allowNull: false,
      }
  });
};
