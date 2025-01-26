const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const productFile = "./database/products.json";
const cartFile = "./database/cart.json";

function readJSONFile(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJSONFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

//Product
app.post("/product", (req, res) => {
    const products = readJSONFile(productFile);
    const newProduct = req.body;
    newProduct.id = Date.now();
    products.push(newProduct);
    writeJSONFile(productFile, products);
    res.status(201).json({ message: "Product created successfully", product: newProduct });
});

app.get("/products", (req, res) => {
    const products = readJSONFile(productFile);
    res.json(products);
});

app.put("/product/:id", (req, res) => {
    const products = readJSONFile(productFile);
    const { id } = req.params;
    const updatedProduct = req.body;

    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    writeJSONFile(productFile, products);
    res.json({ message: "Product updated successfully", product: products[productIndex] });
});

app.get("/product/:id", (req, res) => {
    const products = readJSONFile(productFile);
    const { id } = req.params;

    const product = products.find((p) => p.id === parseInt(id));
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});


app.delete("/product/:id", (req, res) => {
    const products = readJSONFile(productFile);
    const { id } = req.params;

    const filteredProducts = products.filter((p) => p.id !== parseInt(id));
    writeJSONFile(productFile, filteredProducts);

    res.json({ message: "Product deleted successfully" });
});

// Cart
app.post("/cart", (req, res) => {
    const cart = readJSONFile(cartFile);
    const newItem = req.body;
    newItem.id = Date.now();
    cart.push(newItem);
    writeJSONFile(cartFile, cart);
    res.status(201).json({ message: "Item added to cart", item: newItem });
});

app.delete("/cart/:id", (req, res) => {
    const cart = readJSONFile(cartFile);
    const { id } = req.params;

    const filteredCart = cart.filter((item) => item.id !== parseInt(id));
    writeJSONFile(cartFile, filteredCart);

    res.json({ message: "Item removed from cart" });
});

app.get("/cart", (req, res) => {
    const cart = readJSONFile(cartFile);
    res.json(cart);
});

app.put("/cart/:id", (req, res) => {
    const cart = readJSONFile(cartFile);
    const { id } = req.params;
    const updatedItem = req.body;

    const itemIndex = cart.findIndex((item) => item.id === parseInt(id));
    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
    }

    cart[itemIndex] = { ...cart[itemIndex], ...updatedItem };
    writeJSONFile(cartFile, cart);
    res.json({ message: "Cart item updated successfully", item: cart[itemIndex] });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
