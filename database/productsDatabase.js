const fs = require("fs")
const path = require("path")
const filepath = path.join(__dirname, "../db.json")
const READ_DELAY_MS = 1500

let queue = Promise.resolve()

function enqueue(task) {
    const run = queue.then(task)
    queue = run.then(() => {}, () => {})
    return run
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function readProductsFromDisk() {
    await delay(READ_DELAY_MS)
    const data = await fs.promises.readFile(filepath, "utf-8")
    return JSON.parse(data)
}

async function writeProducts(products) {
    await fs.promises.writeFile(
        filepath,
        JSON.stringify(products, null, 2)
    )
}

function nextId(products) {
    return products.reduce((max, product) => {
        const id = Number(product.id)
        return Number.isFinite(id) ? Math.max(max, id) : max
    }, 0) + 1
}

async function getProducts() {
    return enqueue(readProductsFromDisk)
}

async function createProduct(product) {
    return enqueue(async () => {
        const products = await readProductsFromDisk()
        const newProduct = {
            id: nextId(products),
            name: product.name,
            price: product.price
        }
        products.push(newProduct)
        await writeProducts(products)
        return newProduct
    })
}

async function updateProduct(id, updatedProduct) {
    return enqueue(async () => {
        const products = await readProductsFromDisk()
        const index = products.findIndex((x) => x.id === id)

        if (index === -1) {
            return null
        }

        products[index] = {
            id,
            name: updatedProduct.name,
            price: updatedProduct.price
        }

        await writeProducts(products)
        return products[index]
    })
}

async function patchProduct(id, updates) {
    return enqueue(async () => {
        const products = await readProductsFromDisk()
        const index = products.findIndex((x) => x.id === id)
        if (index === -1) {
            return null
        }

        const current = products[index]
        products[index] = {
            ...current,
            ...updates,
            id: current.id
        }

        await writeProducts(products)
        return products[index]
    })
}

async function deleteProduct(id) {
    return enqueue(async () => {
        const products = await readProductsFromDisk()
        const filteredProducts = products.filter((x) => x.id !== id)

        if (filteredProducts.length === products.length) {
            return false
        }

        await writeProducts(filteredProducts)
        return true
    })
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
}
