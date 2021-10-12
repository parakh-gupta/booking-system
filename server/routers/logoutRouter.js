const { Router } = require("express");

const logoutRouter = Router();

async function main() {
  try {
    logoutRouter.get("/", (req, res) => {
      res.clearCookie("jwt");
      res.status(200).send("Logged out");
    });
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

module.exports = logoutRouter;
