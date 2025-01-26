import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_URL } from "../utils";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
}

export default function ManageProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveProduct = async () => {
        try {
            const method = isEdit ? "PUT" : "POST";
            const url = isEdit
                ? `${API_URL}/product/${currentProduct.id}`
                : `${API_URL}/product`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentProduct),
            });

            if (response.ok) {
                fetchProducts();
                setIsModalOpen(false);
                setCurrentProduct({});
                setIsEdit(false);
            } else {
                console.error("Error saving product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/product/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchProducts();
            } else {
                console.error("Error deleting product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setIsEdit(true);
        } else {
            setCurrentProduct({});
            setIsEdit(false);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="manage-product">
            <div className="header">
                <h1>Manage Products</h1>
                <button className="add-button" onClick={() => openModal()}>
                    Add Product
                </button>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4}>Loading...</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.description}</td>
                                <td>₹ {product.price}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => openModal(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="product-modal"
                overlayClassName="product-modal-overlay"
            >
                <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
                <div className="form">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={currentProduct.title || ""}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                title: e.target.value,
                            })
                        }
                    />
                    <label>Description:</label>
                    <textarea
                        value={currentProduct.description || ""}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                description: e.target.value,
                            })
                        }
                    />
                    <label>Price:</label>
                    <input
                        type="number"
                        value={currentProduct.price || ""}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                price: parseFloat(e.target.value),
                            })
                        }
                    />
                    <label>Image URL:</label>
                    <input
                        type="text"
                        value={currentProduct.image || ""}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                image: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="modal-actions">
                    <button className="save-button" onClick={handleSaveProduct}>
                        Save
                    </button>
                    <button
                        className="cancel-button"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}
