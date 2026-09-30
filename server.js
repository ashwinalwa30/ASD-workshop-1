const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
const filepath = path.join(__dirname, "./db.json")
async function readfilewithdelay() {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const data = await fs.promises.readFile(filepath, "utf-8")
                const products = JSON.parse(data)
                resolve(products)
            } catch (error) {
                reject(error)
            }
        }, 1500)
    })
}
app.get("/product", async (req, res) => {
    try {
        const data = await fs.promises.readFile(filepath, "utf-8")
        const products = JSON.parse(data)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        const data = await fs.promises.readFile(filepath, "utf-8")
        const products = JSON.parse(data)
        const id = Number(req.params.id)
        const content = products.find((x) => x.id === id)
        res.status(200).json(content)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})


app.listen(3000)