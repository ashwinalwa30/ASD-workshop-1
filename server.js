const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
const filepath = path.join(__dirname, "./db.json")

app.get("/product", async (req, res) => {
    try {
        const data = await fs.promises.readFile(filepath, "utf-8")
        const products = JSON.parse(data)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})


app.listen(3000)