const { Router } = require("express");
const { MongoClient } = require("mongodb");
const { validateHash } = require("../services/hashingService");
const { createToken } = require("../services/jwtService");

const loginRouter = Router();

async function main() {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    loginRouter.post("/", async (req, res) => {
      if (!req.body.email) {
        res.status(400).send({ msg: "Email not present in request." });
      } else if (!req.body.password) {
        res.status(404).send({ msg: "password not present in request." });
      } else {
        findUser(client, req, res);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

const validatePasswordHash = async (req, res, response) => {
  try {
    validateHash(req.body.password, response.password).then((result) => {
      if (result) {
        const token = createToken(req.body.email);
        res.cookie("jwt", token, {
          maxAge: 100000000,
          httpOnly: true,
          secure: false,
        });
        res.status(200).send({ msg: "User logged in.", userRole: response.userRole});
      } else {
        res.status(404).send({ msg: "Invalid credentials." });
      }
      return result;
    });
  } catch (e) {
    console.error(e);
  }
};

const findUser = async (client, req, res) => {
  try {
    client
      .db("device-booking")
      .collection("users")
      .findOne({ email: req.body.email }, async (err, response) => {
        if (response === null) {
          res.status(404).send({ msg: "User not found." });
        } else {
          await validatePasswordHash(req, res, response);
        }
      });
  } catch (e) {
    console.error(e);
  }
};

main().catch(console.error);

module.exports = loginRouter;
