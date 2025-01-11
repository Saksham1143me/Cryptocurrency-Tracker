const express = require("express")
const { sendDeviation } = require("../controllers/cryptoData")
const router = express.Router()
router.post('/deviation',sendDeviation)
module.exports=router