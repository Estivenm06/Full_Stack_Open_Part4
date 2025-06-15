require("dotenv").config()
const app = require("./app")
const {PORT} = require("./utils/config")

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API running on http://localhost:${PORT}/api`);
})

module.exports = app