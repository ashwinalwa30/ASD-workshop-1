const express = require("express")
const router = express.Router()
const productController = require("../controllers/productsControllers")
const { cacheMiddleware } = require("../middleware/cacheMiddleware")
router.get(["/products", "/product"], cacheMiddleware, productController.getProducts)
router.get(["/products/:id", "/product/:id"], cacheMiddleware, productController.getProductById)
router.post(["/products", "/product"], productController.createProduct)
router.put(["/products/:id", "/product/:id"], productController.updateProduct)
router.patch(["/products/:id", "/product/:id"], productController.patchProduct)
router.delete(["/products/:id", "/product/:id"], productController.deleteProduct)

module.exports = router