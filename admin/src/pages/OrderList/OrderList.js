// OrderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderList.css';

function OrderList() {
    const [products, setProducts] = useState([]);
    const supplierId = 'YOUR_SUPPLIER_ID'; // Replace with the actual supplier ID
    const[qunt,setQ] = useState(0)

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/supplier/products/${supplierId}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleQuantityChange = (index, value) => {
        console.log(value);
        setQ(Number(value))
        const newProducts = [...products];
        newProducts[index].orderQuantity = Number(value);
        
        setProducts(newProducts);
    };

    const handleOrderSubmit = async (product) => {

        console.log(product);
        console.log(qunt);

        try {
          const response = await axios.post('http://localhost:5000/supplier/orders', {
            supplierId, // Assuming you have the supplierId available
            productId: product._id,
            quantity: qunt,
            totalPrice: product.price * product.orderQuantity
          });
          console.log(response.data);
          // Handle successful order submission
        } catch (error) {
          console.error('Error submitting order:', error);
        }
      };
      
      
      

    return (
        <div className="OrderList">
            <h1>Products</h1>
            {products.length > 0 ? (
                <div className="ProductGrid">
                    {products.map((product, index) => (
                        <div key={index} className="ProductItem">
                            <div className="ProductName">Product Name: {product.productName}</div>
                            <div className="ProductBrand">Brand Name: {product.brandName}</div>
                            <div className="ProductQuantity">Available Quantity: {product.quantity}</div>
                            <div className="ProductPrice">Price: RS/= {product.price}</div>
                            <div className="OrderBox">
                                <input type="number" min="1" max={product.quantity} value={product.orderQuantity || 0} onChange={(e) => handleQuantityChange(index, e.target.value)} placeholder="Select quantity" />
                                <div className="TotalPrice">Total: RS/= {(product.price * (product.orderQuantity || 0)).toFixed(2)}</div>
                                <button className="OrderButton" onClick={() => handleOrderSubmit(product)}>Place Order</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}

export default OrderList;