const express = require("express")
const app = express()
const productRoutes = require("./routes/productsRoutes")

app.use(express.json())
app.use(productRoutes)

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON"
        })
    }
    return res.status(500).json({
        message: "Server Error"
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
