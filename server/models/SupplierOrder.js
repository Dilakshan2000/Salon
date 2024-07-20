const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId: { type: String, ref: 'SupplierProduct', required: true },
    supplierId: { type: String, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] }
  });
  
  
const Order = mongoose.model('supplierproduct', orderSchema);

module.exports = Order;

