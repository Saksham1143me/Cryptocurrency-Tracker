const express = require("express")
const { sendStats } = require("../controllers/cryptoData")
const router = express.Router()
router.post('/stats',sendStats)
module.exports=router