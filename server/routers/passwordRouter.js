const { Router } = require("express");
const { MongoClient } = require("mongodb");
const { validateHash, generateHash } = require("../services/hashingService");

const loginRouter = Router();

async function main() {
  const client = new MongoClient(process.env.MONGO_URL);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    loginRouter.post("/change/", async (req, res) => {
      console.log(req.body);
      if (!req.body.currentPassword) {
        res.status(400).send({ msg: "Current password not present in request." });
      } else if (!req.body.newPassword) {
        res.status(400).send({ msg: "New password not present in request." });
      } else if (!req.body.confirmPassword) {
        res.status(400).send({ msg: "Confirm password not present in request." });
      } else if (!req.body.email) {
        res.status(400).send({ msg: "Email not present in request." });
      } else {
        findUser(client, req, res);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

const validatePasswordHash = async (client, req, res, response) => {
  try {
    console.log(req.body, response)
    validateHash(req.body.currentPassword, response.password).then((result) => {
      if (result) {
        generateHash(req.body.newPassword).then(async (passwordHash) => {
          try {
            client
              .db("device-booking")
              .collection("users")
              .updateOne(
                { email: req.body.email },
                { $set: { password: passwordHash } },
                async (err, response) => {
                  if (response === null) {
                    res.status(400).send({ msg: "An error occurred." });
                  } else {
                    console.log(response)
                    res.status(200).send({ msg: "Password change successfully." });
                  }
                }
              );
          } catch (e) {
            console.error(e);
          }
        })
      } else {
        res.status(400).send({ msg: "Invalid credentials.", statusCode: 404 });
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
        console.log("response = " + JSON.stringify(response))
        if (response === null) {
          res.status(404).send({ msg: "User not found." });
        } else {
          await validatePasswordHash(client, req, res, response);
        }
      });
  } catch (e) {
    console.error(e);
  }
};

main().catch(console.error);

module.exports = loginRouter;
