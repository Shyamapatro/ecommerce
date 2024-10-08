const Models = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const redisClient = require('../../utills/redisUtil');
const { CartItem, Product, Order,Cart ,OrderItem} = require("../../models");

exports.signupUser = async (req, res) => {
    try {
        const { firstName, lastName, email, countryCode, phoneNumber, password } = req.body;

        const existingUser = await Models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                statusCode: 409,
                message: "Email already in use.",
            });
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await Models.User.create({ firstName, lastName, email, countryCode, phoneNumber, password: hashPassword });
        res.status(201).json({
            message: 'User created successfully.',
            user
        });
    } catch (error) {
        console.error("Error adding new data:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email and password are required.",
            });
        }

        const user = await Models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found.",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid password.",
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '48h' });
        const key = `x-access-token:${user.id}`;
        await redisClient.set(key, token, 'EX', 48 * 60 * 60);

        const { id, firstName, lastName } = user;
        res.status(200).json({
            message: 'Login successful.',
            user: { id, firstName, lastName, email },
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers['x-access-token']
        if (!token) {
            return res.status(400).json({
                statusCode: 400,
                message: "Token is required for logout.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const key = `x-access-token:${userId}`;
        await redisClient.del(key);

        res.status(200).json({
            message: 'Logout successful.',
        });
    } catch (error) {
        console.error("Error logging out user:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

exports.getDetails = async (req, res) => {
    try {
        const userId = req.userId; const user = await Models.User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email']
        });

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found."
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "User details fetched successfully.",
            data: user
        });

    } catch (error) {
        console.error("Error fetching user details:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
}

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    return res.status(200).json({ success: true, cartItem });
  } catch (error) {
    console.error("Error when addtocart:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
  }
};

exports.checkout = async (req, res) => {
    try {
        const userId = req.userId;
      const cart = await Cart.findOne({
        where: { userId },
        include: { model: CartItem, include: [Product] 
        }
      });
      
      if (!cart || cart.CartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      let subtotal = 0;
      cart.CartItems.forEach(item => {
        subtotal += item.quantity * item.Product.price;
      });
  
      const shippingCost = 5; 
      const taxes = subtotal * 0.18; 
      const totalPrice = subtotal + shippingCost + taxes;
  
      return res.status(200).json({
        success: true,
        cart: {
          items: cart.CartItems,
          subtotal,
          shippingCost,
          taxes,
          totalPrice,
        }
      });
    } catch (error) {
        console.error("Error while checkout:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
  
// Place Order
exports.placeOrder = async (req, res) => {
   
    try {
     const { userId, paymentMethod, shippingAddress } = req.body;
      const cart = await Cart.findOne({
        where: { userId },
        include: { model: CartItem, include: [Product] }
      });
      console.log(cart)
      if (!cart || cart.CartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      let totalPrice = 0;
      cart.CartItems.forEach(item => {
        totalPrice += item.quantity * item.Product.price;
      });
  
      const shippingCost = 5; 
      const taxes = totalPrice * 0.18; 
      totalPrice += shippingCost + taxes;
      const transaction = await Models.sequelize.transaction();
      const order = await Order.create({
        userId,
        totalPrice,
        paymentMethod, 
        shippingAddress,
        status: 'Pending'
      });
  
      await Promise.all(cart.CartItems.map(async item => {
        await OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price
        }, { transaction });
    }));
  
    await CartItem.destroy({ where: { cartId: cart.id }, transaction });
    await transaction.commit();
  
      return res.status(200).json({
        success: true,
        order,
        message: 'Order placed successfully'
      });
    } catch (error) {
        await transaction.rollback();
        console.error("Error placeing  orders:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.userId;  
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                }
            ]
        });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);

        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error.",
        });
    }
};
