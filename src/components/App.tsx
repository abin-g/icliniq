import React, { useState, useEffect } from "react";
import Header from "./Header";
import ProductGrid from "./ProductGrid";
import Modal from "react-modal";
import { API_URL } from "../utils";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
}


export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<number[]>([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as number[];
        setCartItems(storedCart);
    }, []);

    const addToCart = (productId: number) => {
        const updatedCart = [...cartItems, productId];
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId: number) => {
        const updatedCart = cartItems.filter((id) => id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleCheckout = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
        alert("Thank you for your purchase!");
        setIsCartModalOpen(false);
    };

    const cartProducts = cartItems
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean) as Product[];

        const toggleCartModal = () => {
            setIsCartModalOpen(!isCartModalOpen);
        };


    return (
        <>
            <Header cartCount={cartItems.length} />
            <ProductGrid products={products} addToCart={addToCart} />

            <div className="floating-cart" onClick={toggleCartModal}>
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/shopping-basket-white-icon.png" width="50%" alt="Cart" />
             <span className="cart-count">{cartItems.length}</span>
            </div>

            <Modal
                isOpen={isCartModalOpen}
                onRequestClose={toggleCartModal}
                className="cart-modal"
                overlayClassName="cart-overlay"
            >
                <div className="cart-modal-header">
                    <h2>Shopping Cart</h2>
                    <button className="close-button" onClick={toggleCartModal}>
                        ✖
                    </button>
                </div>
                <div className="cart-modal-content">
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <div className="cart-item" key={product.id}>
                                <img src={product.image} alt={product.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{product.title}</h3>
                                    <p className="cart-item-price">₹ {product.price.toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="remove-button"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty!</p>
                    )}
                </div>
                {cartProducts.length > 0 && (
                    <div className="cart-modal-footer">
                        <button 
                        onClick={handleCheckout}
                        className="checkout-button">Proceed to Checkout</button>
                    </div>
                )}
            </Modal>

        </>
    );
}
