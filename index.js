const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("ideavault");
    const ideaCollection = db.collection("ideas");
    const commentCollection = db.collection("comments");

    // post the idea data
    app.post("/ideas", async (req, res) => {
      const idea = req.body;
      // console.log(idea);
      const result = await ideaCollection.insertOne(idea);

      res.json(result);
    });

    // get the idea data
    app.get("/ideas", async (req, res) => {
      const result = await ideaCollection.find().toArray();

      res.json(result);
    });

    // get the idea by creator
    app.get(`/ideas/:userId`, async (req, res) => {
      const { userId } = req.params;

      const result = await ideaCollection
        .find({
          createdBy: userId,
        })
        .toArray();

      res.json(result);
    });

    // get details idea
    app.get(`/ideas/details/:id`, async (req, res) => {
      const { id } = req.params;

      const result = await ideaCollection.findOne({ _id: new ObjectId(id) });

      res.json(result);
    });

    //update idea
    app.patch(`/ideas/:ideaId`, async (req, res) => {
      const { ideaId } = req.params;
      const updatedData = req.body;

      const result = await ideaCollection.updateOne(
        { _id: new ObjectId(ideaId) },
        {
          $set: updatedData,
        },
      );

      res.json(result);
    });

    // delete idea
    app.delete(`/ideas/:ideaId`, async (req, res) => {
      const { ideaId } = req.params;

      const result = await ideaCollection.deleteOne({
        _id: new ObjectId(ideaId),
      });

      res.json(result);
    });

    // store comment
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);

      res.json(result);
    });

    // fetch comments by ideaID
    app.get(`/comments/:ideaId`, async (req, res) => {
      const { ideaId } = req.params;
      const result = await commentCollection.find({ idea: ideaId }).toArray();

      res.json(result);
    });

    //get personal comment
    app.get("/comments/myInteraction/:id", async (req, res) => {
      const { id } = req.params;
      const result = await commentCollection.find({ userId: id }).toArray();

      res.json(result);
    });

    // update the comment
    app.patch(`/comments/:id`, async (req, res) => {
      const { id } = req.params;
      // console.log(id);
      const updatedData = req.body;

      const result = await commentCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updatedData,
        },
      );

      res.json(result);
    });

    // delete the comment
    app.delete("/comments/:id", async (req, res) => {
      const { id } = req.params;

      const result = await commentCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
