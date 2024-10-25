const express = require("express");
const app = express();
const port = 3004;

// Counter structure
let count = 0;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to increment the counter
app.post("/increment", (req, res) => {
  const numIncrements = req.body.numIncrements || 1;

  // Simulate concurrent increments using promises
  const promises = [];
  for (let i = 0; i < numIncrements; i++) {
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          count++;
          resolve();
        }, 0); // Use 0 delay to simulate concurrent behavior
      })
    );
  }

  Promise.all(promises)
    .then(() => {
      res.json({ message: `Counter incremented by ${numIncrements}`, count });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error incrementing counter" });
    });
});

// Route to get the current counter value
app.get("/count", (req, res) => {
  res.json({ count });
});

// Start the server
app.listen(port, () => {
  console.log(`Counter app listening at http://localhost:${port}`);
});
