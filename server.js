const http = require('http')
const router = require('./router')
const PORT = process.env.PORT || 8000

const server = http.createServer(async (req, res) => {
  router(req, res)
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
