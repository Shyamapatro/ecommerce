module.exports = function (Sequelize, sequelize, DataTypes) {
    return sequelize.define("Cart", {
        ...require("./core")(Sequelize, DataTypes),
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    });
};
