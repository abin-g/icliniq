import React from "react";

interface HeaderProps {
    cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
    return (
        <header className="header">
            <h1 className="header-title">🛍️ Shopping Cart</h1>
            <div className="cart-icon">
                🛒 <span className="cart-count">{cartCount}</span>
            </div>
        </header>
    );
}
