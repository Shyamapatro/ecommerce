const productController = require("../../controllers/Product/productController");
const routeBaseUrl = "/api/product";
const validator = require("./celebrateValidator");
module.exports = app => {
    
    app.post(routeBaseUrl + "/addProduct",validator.addProduct,productController.addProduct);
    
 }