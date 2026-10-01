const productService = require("../services/productsServices")
const cache = require("../middleware/cacheMiddleware")

function parseId(param) {
    const id = Number(param)
    if (!Number.isInteger(id) || id <= 0) {
        return null
    }
    return id
}

function handleError(res, error) {
    const status = error.status || 500
    res.status(status).json({
        message: error.status ? error.message : "Server Error"
    })
}

async function getProducts(req, res) {
    try {
        const products = await productService.getAllProducts()
        cache.setCache(req.cacheKey, products)
        res.status(200).json(products)
    } catch (error) {
        handleError(res, error)
    }
}

async function getProductById(req, res) {
    try {
        const id = parseId(req.params.id)
        if (id === null) {
            return res.status(400).json({
                message: "Invalid product id"
            })
        }

        const product = await productService.getProductById(id)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        cache.setCache(req.cacheKey, product)
        res.status(200).json(product)
    } catch (error) {
        handleError(res, error)
    }
}

async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body)
        cache.clearCache()
        res.status(201).json(product)
    } catch (error) {
        handleError(res, error)
    }
}

async function updateProduct(req, res) {
    try {
        const id = parseId(req.params.id)
        if (id === null) {
            return res.status(400).json({
                message: "Invalid product id"
            })
        }

        const product = await productService.updateProduct(id, req.body)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        cache.clearCache()
        res.status(200).json(product)
    } catch (error) {
        handleError(res, error)
    }
}

async function patchProduct(req, res) {
    try {
        const id = parseId(req.params.id)
        if (id === null) {
            return res.status(400).json({
                message: "Invalid product id"
            })
        }

        const product = await productService.patchProduct(id, req.body)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        cache.clearCache()
        res.status(200).json(product)
    } catch (error) {
        handleError(res, error)
    }
}

async function deleteProduct(req, res) {
    try {
        const id = parseId(req.params.id)
        if (id === null) {
            return res.status(400).json({
                message: "Invalid product id"
            })
        }

        const deleted = await productService.deleteProduct(id)
        if (!deleted) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        cache.clearCache()
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}
