
const express = require('express');
const router = express.Router();


router.use("/v1/api", require("./access"));
// router.get('', (req, res) => {
//   res.send('Hello World!');
// });

module.exports = router;