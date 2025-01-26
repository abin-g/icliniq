import React from "react";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    product: Product;
    addToCart: (product: Product) => void;
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <div className="price-cart">
                <span>₹{product.price}</span>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
        </div>
    );
}
