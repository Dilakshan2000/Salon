const express = require('express');
const router = express.Router();
const User = require("../models/User");
const SupplierProduct = require("../models/Supplier");
const Order = require('../models/Order');
const SupplierOrder = require('../models/SupplierOrder');
const sendEmail = require('../sendEmail/sendEmail');
const EmailTemplate = require('../sendEmail/EmailTemplate');







router.post('/register', async (req, res) => {
    const { first_name, last_name, mobile_number, email, password, type, sup_category } = req.body;
  
    if (!first_name || !last_name || !mobile_number || !email || !password || !type || !sup_category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
  
      const user = new User({
        first_name,
        last_name,
        mobile_number,
        email,
        password,
        type,
        sup_category,
      });
  
      await user.save();
  
      
      const emailContent = EmailTemplate({ first_name, email, mobile_number, password });
  
      
      sendEmail(email, "Registration Successful", emailContent);
  
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Get all suppliers
router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find({ type: 'supplier' });
        res.json(users);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a supplier
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        await User.deleteOne({ _id: id });
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/getById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.type !== 'supplier') {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/profile', async (req, res) => {
  if (!req.current_user) {
      return res.status(401).json({
          status: "auth_failed",
          message: "User authentication required."
      });
  }

  try {
      const userId = req.current_user.user_id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({
              status: "not_found",
              message: "User not found."
          });
      }

      
      res.json({
          status: "success",
          email: user.email,  // Highlighting the email
          mobile_number: user.mobile_number,
          first_name: user.first_name,
          last_name: user.last_name
      });
  } catch (error) {
      console.error('Error retrieving user profile:', error);
      res.status(500).json({
          status: "error",
          message: "Server error occurred while fetching profile."
      });
  }
});
// Update a supplier
router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedSupplier = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a route to fetch products of a specific supplier
router.get('/products/:supplierId', async (req, res) => {
    const { supplierId } = req.params;
    try {
        const products = await SupplierProduct.find({ supplierId });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Adjust the route for adding a product to associate the product with the supplier ID
router.post('/add-product/:supplierId', async (req, res) => {
    const { productName, brandName, quantity, price } = req.body;
    const { supplierId } = req.params;
    try {
        const newProduct = new SupplierProduct({ productName, brandName, quantity, price, supplierId });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});;

  router.delete('/delete-product/:supplierId/:productId', async (req, res) => {
  const { supplierId, productId } = req.params;
  try {
    const deletedProduct = await SupplierProduct.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
    const { productId, quantity, totalPrice} = req.body;

    var q = Number(quantity);

    SupplierOrder.findOneAndUpdate({_id:productId},{ quantity: q, totalPrice:totalPrice }).then(()=>{
        res.status(201).json({ message: 'Order created successfull' });
    }).catch((e)=>{
        res.send("Error - "+e);
    });

  });
  
  router.patch('/orders/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/orders/:supplierId', async (req, res) => {
    const { supplierId } = req.params;
  
    try {
      const orders = await Order.find({ supplierId })
        .populate('productId', 'productName brandName price')
        .exec();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
module.exports = router;

