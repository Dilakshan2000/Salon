import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SupplierOrder.css';

function SupplierOrder() {
    const [productName, setProductName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);
    const supplierId = 'YOUR_SUPPLIER_ID';
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/supplier/orders/${supplierId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };



    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/supplier/products/${supplierId}`);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch products');
            setProducts([]); // Ensure products is reset to an empty array on error
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/supplier/add-product/${supplierId}`, {
                productName, brandName, quantity: Number(quantity), price: Number(price),
            });
            setMessage(response.data.message);
            setProductName('');
            setBrandName('');
            setQuantity(0);
            setPrice(0);
            fetchProducts();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleProductDelete = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/supplier/delete-product/${supplierId}/${productId}`);
            setMessage(response.data.message);
            fetchProducts();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to delete product');
        }
    };
    const handleOrderAction = async (orderId, action) => {
      try {
        const response = await axios.patch(`http://localhost:5000/supplier/orders/${orderId}`, { status: action });
        console.log(response.data.message);
        fetchOrders(); // Refresh the orders after updating the status
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };

    return (
        <div className="supplier-section">
            <div className="add-product-section">
                <h1>Add Product</h1>
                <form className="add-product-form" onSubmit={handleProductSubmit}>
                    <label> Product Name:
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </label>
                    <label> Brand Name:
                        <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                    </label>
                    <label> Quantity:
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </label>
                    <label> Price:
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </label>
                    <button type="submit">Add Product</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
            <div className="product-details-section">
                <h2>Products</h2>
                {products.length > 0 ? (
                    <ul className="product-grid">
                        {products.map((product, index) => (
                            <li key={index} className="product-item">
                                <strong>Product Name:</strong> {product.productName}<br />
                                <strong>Brand Name:</strong> {product.brandName}<br />
                                <strong>Quantity:</strong> {product.quantity}<br />
                                <strong>Price:</strong> {product.price}<br/>
                                <strong>New Order :  {product.quantity}</strong><br/>
                                <button onClick={() => handleProductDelete(product._id)}>Delete</button>
                                {/* Display orders for the product */}
                                {orders
            .filter(order => order.productId === product._id)
            .map(order => (
              <div key={order._id} className="order-item">
                                        <p>Order Quantity: {order.quantity}</p>
                                        <p>Total Price: {order.totalPrice}</p>
                                        <p>Status: {order.status}</p>
                                        {order.status === 'pending' && (
                                            <div>
                                                <button onClick={() => handleOrderAction(order._id, 'accepted')}>Accept</button>
                                                <button onClick={() => handleOrderAction(order._id, 'rejected')}>Reject</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default SupplierOrder;