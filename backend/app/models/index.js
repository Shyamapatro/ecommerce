var Sequelize = require("sequelize");
var sequelize = require("../../dbConnection").sequelize;

const models = {
    User: require("./User")(Sequelize, sequelize, Sequelize.DataTypes),
    CartItem: require("./CartItem")(Sequelize, sequelize, Sequelize.DataTypes),
    Product: require("./Product")(Sequelize, sequelize, Sequelize.DataTypes),
    Order: require("./Order")(Sequelize, sequelize, Sequelize.DataTypes),
    Cart:require("./Cart")(Sequelize, sequelize, Sequelize.DataTypes),
    OrderItem: require("./OrderItem")(Sequelize, sequelize, Sequelize.DataTypes)
    
};

// Associations
models.User.hasOne(models.Cart, { foreignKey: 'userId' });
models.Cart.belongsTo(models.User, { foreignKey: 'userId' });

models.Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
models.CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });

models.Product.hasMany(models.CartItem, { foreignKey: 'productId' });
models.CartItem.belongsTo(models.Product, { foreignKey: 'productId' });

models.User.hasMany(models.Order, { foreignKey: 'userId' });
models.Order.belongsTo(models.User, { foreignKey: 'userId' });

models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });

models.Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
models.OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });

models.sequelize = sequelize;
models.Sequelize = Sequelize;
module.exports = models;
