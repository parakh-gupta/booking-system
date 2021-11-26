const { Router } = require("express");
const { MongoClient } = require("mongodb");

const bookingRouter = Router();

async function main() {
    const client = new MongoClient(process.env.MONGO_URL);
    try {

    // Connect to the MongoDB cluster
    await client.connect();

    bookingRouter.post("/", async(req, res) => {
        if (!req.body.deviceId) {
            res.status(400).send({ msg: "Device ID not present in request" });
        } else if (!req.body.dates) {
            res.status(400).send({ msg: "Dates not present in request" });
        } else if (!req.body.emailId) {
            res.status(400).send({ msg: "User Details not present in request" });
        }else {
          let data = {};
          await client
            .db("device-booking")
            .collection("devices")
            .findOne({ id: req.body.deviceId }, async (err, response) => {
              data = response;
            });

            await client
            .db("device-booking")
            .collection("devices")
            .updateMany({id: req.body.deviceId},{ $set: {availability: false, user: req.body.emailId}}, async (err, response) => {
            if (response.matchedCount == 0) {
                res.status(404).send({ msg: "No device available" });
            } else {
                res.status(200).send(data);
            }
            });
          }
        });
    }catch (e) {
        console.error(e);
      }
    }
    
    main().catch(console.error);
    
    module.exports = bookingRouter;