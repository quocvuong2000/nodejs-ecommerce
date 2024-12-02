const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
// const AccessService = require("../services/access.service");
const router = express.Router();

// router.get("/permission", async (req, res) => {
//   console.log("generateApiPermissionKey");
//   return res.status(200).json({
//     message: "Success",
//     data: await AccessService.generateApiPermissionKey(),
//   });
// });
// check api key
router.use(apiKey);
// check permission
router.use(permission("0000"));

router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
