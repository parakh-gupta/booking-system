const { Router } = require("express");
const { MongoClient } = require("mongodb");
const { generateUuid } = require("../services/uuidService");

const devicesRouter = Router();

/* Request example */
/*
Post call
{
  "deviceName": "rsp",
  "type": "dut",
  "user": "user1",
  "ipaddress": "0.0.0.0",
  "availability" : true,
  "team" : "hmi"
}
*/

async function main() {
    const client = new MongoClient(process.env.MONGO_URL);
    try {

    // Connect to the MongoDB cluster
    await client.connect();
    
    //get all devices
    devicesRouter.get("/", async(req, res) => {
      await client
      .db("device-booking")
      .collection("devices")
      .find({}).toArray( async (err, response) => {
        if (response == null) {
          res.status(404).send({ msg: "No device available" });
        } else {
          res.status(200).send(response);
        }
      });
    });
  
    //get one device
    devicesRouter.get("/:id", async(req, res) => {
      await client
      .db("device-booking")
      .collection("devices")
        .findOne({id: req.params.id}), async (err, response) => {
        console.log(req.params.id)
        if (response == null) {
          res.status(404).send({ msg: "No device available" });
        } else {
          res.status(200).send(response);
        }
      };
    });

    //create new device
     devicesRouter.post("/", async(req, res) => {
         console.log(req.body)
        if (!req.body.deviceName) {
            res.status(400).send({ msg: "Device Name not present in request" });
        } else if (!req.body.type) {
          res.status(400).send({ msg: "Device Type not present in request" });
        } else if (!req.body.user) {
            res.status(400).send({ msg: "User not present in request" });
        } else if (!req.body.ipaddress) {
            res.status(400).send({ msg: "IP address not present in request" });
        } else if (!req.body.availability) {
          res.status(400).send({ msg: "Device availability not present in request" });
        } else if (!req.body.team) {
          res.status(400).send({ msg: "Team not present in request" });
        } else {
          const data = {
            id: 0,
            deviceName: req.body.deviceName,
            type: req.body.type,
            user: req.body.user,
            ipaddress: req.body.ipaddress,
            availability: req.body.availability,
            team: req.body.team,
          };
          data.id = generateUuid();
        await client
        .db("device-booking")
        .collection("devices")
        .insertOne(data, (err) => {
          try {
            res.status(200).send({ msg: "Device added successfully!", data });
          } catch (e) {
            console.error(e);
          }
        });
    }
    });

    devicesRouter.put("/", async(req, res) => {
        console.log(req.body)
        if (!req.body.id) {
            res.status(400).send({ msg: "Device ID not present in request" });
        } else if (!req.body.deviceName) {
            res.status(400).send({ msg: "Device Name not present in request" });
        } else if (!req.body.type) {
          res.status(400).send({ msg: "Device Type not present in request" });
        } else if (!req.body.user) {
            res.status(400).send({ msg: "User not present in request" });
        } else if (!req.body.ipaddress) {
            res.status(400).send({ msg: "IP address not present in request" });
        } else if (!req.body.availability) {
          res.status(400).send({ msg: "Device availability not present in request" });
        } else if (!req.body.team) {
          res.status(400).send({ msg: "Team not present in request" });
        } else {
            const myquery = { id: req.body.id };
            const newvalues = { $set: req.body };
            console.log(newvalues)
        await client
        .db("device-booking")
        .collection("devices")
        .updateOne(myquery, newvalues, async (err, response) => {
          if (response.modifiedCount == 0) {
            res.status(404).send({ msg: "No device available" });
          } else {
            res.status(200).send(response);
          }
        });
    }
    });

    devicesRouter.delete("/:id", async(req, res) => {
      const myquery = { id: req.params.id };
      await client
        .db("device-booking")
        .collection("devices")
        .deleteOne(myquery, async (err, response) => {
          if (response.deletedCount == 0) {
            res.status(404).send({ msg: "No device available" });
          } else {
            res.status(200).send(response);
          }
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

main().catch(console.error);

module.exports = devicesRouter;