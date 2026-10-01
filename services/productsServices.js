const database = require("../database/productsDatabase")

function httpError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

function validateName(name, required) {
    if (name === undefined) {
        if (required) {
            throw httpError(400, "Name is required")
        }
        return
    }
    if (typeof name !== "string" || name.trim() === "") {
        throw httpError(400, "Name must be a non-empty string")
    }
}

function validatePrice(price, required) {
    if (price === undefined) {
        if (required) {
            throw httpError(400, "Price is required")
        }
        return
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        throw httpError(400, "Price must be a non-negative number")
    }
}

function validateProduct(product, { partial }) {
    if (!product || typeof product !== "object" || Array.isArray(product)) {
        throw httpError(400, "Invalid product payload")
    }

    validateName(product.name, !partial)
    validatePrice(product.price, !partial)

    if (partial && product.name === undefined && product.price === undefined) {
        throw httpError(400, "No valid fields to update")
    }
}

async function getAllProducts() {
    return await database.getProducts()
}

async function getProductById(id) {
    const products = await database.getProducts()
    return products.find((x) => x.id === id)
}

async function createProduct(product) {
    validateProduct(product, { partial: false })
    return await database.createProduct({
        name: product.name.trim(),
        price: product.price
    })
}

async function updateProduct(id, product) {
    validateProduct(product, { partial: false })
    return await database.updateProduct(id, {
        name: product.name.trim(),
        price: product.price
    })
}

async function patchProduct(id, updates) {
    validateProduct(updates, { partial: true })
    const patch = {}
    if (updates.name !== undefined) {
        patch.name = updates.name.trim()
    }
    if (updates.price !== undefined) {
        patch.price = updates.price
    }
    return await database.patchProduct(id, patch)
}

async function deleteProduct(id) {
    return await database.deleteProduct(id)
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}
