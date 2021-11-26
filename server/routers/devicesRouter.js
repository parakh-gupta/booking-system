const { Router } = require("express");
const { MongoClient } = require("mongodb");
const { generateUuid } = require("../services/uuidService");

const devicesRouter = Router();

const defaultUser = process.env.DEFAULT_USER

/* Request example */
/*
Post call
{
  "deviceName": "rsp",
  "type": "dut",
  "ipaddress": "0.0.0.0",
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
        .find({id: req.params.id}).toArray( async (err, response) => {
        if (response.length<=0) {
          res.status(404).send({ msg: "No device available" });
        } else {
          res.status(200).send(response[0]);
        }
      });
    });

    //get device of one user
    devicesRouter.post("/email", async(req, res) => {
      console.log(req.body.email)
      await client
      .db("device-booking")
      .collection("devices")
        .find({user: req.body.email}).toArray( async (err, response) => {
          console.log(response)
        if (response==null) {
          res.status(404).send({ msg: "No device available" });
        } else {
          res.status(200).send(response);
        }
      });
    });

    //create new device
     devicesRouter.post("/", async(req, res) => {
        if (!req.body.deviceName) {
            res.status(400).send({ msg: "Device Name not present in request" });
        } else if (!req.body.type) {
          res.status(400).send({ msg: "Device Type not present in request" });
        } else if (!req.body.ipaddress) {
            res.status(400).send({ msg: "IP address not present in request" });
        } else if (!req.body.team) {
          res.status(400).send({ msg: "Team not present in request" });
        } else {
          const data = {
            id: 0,
            deviceName: req.body.deviceName,
            type: req.body.type,
            user: defaultUser,
            ipaddress: req.body.ipaddress,
            availability: true,
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

    devicesRouter.put("/", async (req, res) => {
      if (!req.body.id) {
          res.status(400).send({ msg: "Device ID not present in request" });
      } else if (!req.body.deviceName) {
          res.status(400).send({ msg: "Device Name not present in request" });
      } else if (!req.body.type) {
        res.status(400).send({ msg: "Device Type not present in request" });
      } else if (!req.body.ipaddress) {
          res.status(400).send({ msg: "IP address not present in request" });
      } else if (!req.body.team) {
        res.status(400).send({ msg: "Team not present in request" });
      } else {
        const myquery = { id: req.body.id };
        const newvalues = { $set: {
          deviceName: req.body.deviceName,
          type: req.body.type,
          team: req.body.team,
          ipaddress: req.body.ipaddress
          }
        };
        await client
        .db("device-booking")
        .collection("devices")
          .updateMany(myquery, newvalues, async (err, response) => {
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