const { Router, response } = require("express");
const { MongoClient } = require("mongodb");
const { generateHash } = require("../services/hashingService");
const { generateUuid } = require("../services/uuidService");

const signupRouter = Router();

async function main() {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    signupRouter.post("/", async (req, res) => {
      if (!req.body.email) {
        res.status(400).send({ msg: "Email ID not present in request" });
      } else if (!req.body.password) {
        res.status(400).send({ msg: "Password not present in request" });
      } else if (!req.body.firstName) {
        res.status(400).send({ msg: "First name not present in request" });
      } else if (!req.body.lastName) {
        res.status(400).send({ msg: "Last name not present in request" });
      } else if (!req.body.devices) {
        res.status(400).send({ msg: "Devices not present in request" });
      } else {
        await checkUserExists(client, req, res);
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

const checkUserExists = async (client, req, res) => {
  try {
    await client
      .db("device-booking")
      .collection("users")
      .findOne({ email: req.body.email }, async (err, response) => {
        if (response != null) {
          res.status(404).send({ msg: "User already exists." });
        } else {
          generateHashPassword(req, client, res);
        }
      });
  } catch (e) {
    console.error(e);
  }
};

const generateHashPassword = async (req, client, res) => {
  try {
    generateHash(req.body.password).then(async (passwordHash) => {
      const data = {
        email: req.body.email,
        password: passwordHash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: req.body.userType,
      };
      await createUser(client, data, res);
    });
  } catch (e) {
    console.error(e);
  }
};

const createUser = (client, data, res) => {
  data.id = generateUuid();
  client
    .db("device-booking")
    .collection("users")
    .insertOne(data, (err) => {
      try {
        const response = {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          devices: data.devices,
        };
        res.status(200).send({ msg: "User created successfully!", response });
      } catch (e) {
        console.error(e);
      }
    });
};

main().catch(console.error);

module.exports = signupRouter;
