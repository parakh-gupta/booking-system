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
        } else {
          await client
          .db("device-booking")
            .collection("devices")
              .find({id: req.body.deviceId}).toArray( async (err, response) => {
              if (response == null) {
                res.status(404).send({ msg: "No device available" });
              } else {
                res.status(200).send(response);
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