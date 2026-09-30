const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port= 3000;
const filePath = path.join(__dirname, 'db.json');

async function readFile() {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}
app.get('/', (req, res) => {

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});