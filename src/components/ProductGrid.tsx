import React from "react";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
}

interface ProductGridProps {
    products: Product[];
    addToCart: (productId: number) => void;
}

export default function ProductGrid({ products, addToCart }: ProductGridProps) {
    const gridSize = 5;
    const placeholders = Array.from({ length: gridSize - products.length });

    return (
        <div className="product-grid">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.title}/>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <div className="price-cart">
                        <span>₹{product.price}</span>
                        <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                    </div>
                </div>
            ))}

            {placeholders.map((_, index) => (
                <div key={`placeholder-${index}`} className="product-card placeholder" />
            ))}
        </div>
    );
}
