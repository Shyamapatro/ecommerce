const Sequelize = require("sequelize");
const config=require("./app/config/db.config");
console.log(config.databaseName,
	config.user,
	config.password, config.host)
var sequelize = new Sequelize(
	config.databaseName,
	config.user,
	config.password, {
		host: config.host,
		dialect: "postgres",
	});
var connectDB = () => {
	sequelize.authenticate()
		.then(() => {
			sequelize.sync();
			console.log("Connection has been established successfully.");
		})
		.catch(err => {
			console.error("Unable to connect to the database:", err);
		});
};
module.exports = {
	connectDB: connectDB,
	sequelize: sequelize
};