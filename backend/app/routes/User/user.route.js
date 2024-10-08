const usersController = require("../../controllers/User/usersController");
const routeBaseUrl = "/api/user";
const authJwt= require("../../middlewares/authJwt"); 
const validator = require("./celebrateValidator");
module.exports = app => {
    
    app.post(routeBaseUrl + "/signup",validator.signup,usersController.signupUser);
    app.post(routeBaseUrl + "/login",validator.login,usersController.login);
    app.post(routeBaseUrl + "/logout",usersController.logout);
   
    app.post(routeBaseUrl + "/addtoCart",[authJwt.verifyToken],usersController.addToCart);
    app.post(routeBaseUrl + "/checkout",[authJwt.verifyToken],usersController.checkout);
    app.post(routeBaseUrl + "/placeOrder",[authJwt.verifyToken],usersController.placeOrder);
    app.get(routeBaseUrl + "/getOrders",[authJwt.verifyToken],usersController.getOrders);
    
    app.get(routeBaseUrl + "/getDetails",[authJwt.verifyToken],usersController.getDetails);
    
 }