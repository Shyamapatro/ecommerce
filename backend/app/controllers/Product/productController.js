const Models = require("../../models");
const {  Product } = require("../../models");

exports.addProduct = async (req, res) => {
    try {
        const { name, price, stock, description, category } = req.body;

        const product = await Product.create({
            name,
            price,
            stock,
            description,
            category,
        });

        res.status(201).json({
            message: 'Product created successfully.',
            product,
        });
    } catch (error) {
        console.error("Error adding new data:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};