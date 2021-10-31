const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4yggv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log('database connected succesfully');
        const database = client.db("developerTour");
        const servicesCollection = database.collection("services");
        const bookingCollection = database.collection("booking");
        const updateCollection = database.collection("update");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET single services
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // add service
        app.post("/services", async (req, res) => {
            console.log(req.body);
            const result = await servicesCollection.insertOne(req.body);
            console.log(result);
        });

        //   POST API
        app.post("/booking", async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log("booking", booking);
            res.json(result);
        });

        // GET booking
        app.get("/booking", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });


        app.get("/update", async (req, res) => {
            const result = await updateCollection.find({}).toArray();
            res.send(result);
        });

        // delete event
        app.delete("/booking/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // PUT API
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updateDetails = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateDetails.status,
                },
            };
            const result = await updateCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
        });
    } finally {
        //  await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Developer Tour server is running");
});

app.listen(port, () => {
    console.log("server running at port", port);
});
// const database = client.db("developerTour");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4yggv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`