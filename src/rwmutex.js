const express = require("express");
const app = express();
const PORT = 3001;

let counter = 0;
let readers = 0;
let writeLock = false;

// Simulate delay to show concurrent reads
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Read lock function
async function acquireReadLock() {
  return new Promise((resolve) => {
    const tryLock = () => {
      if (!writeLock) {
        // Proceed if no write lock
        readers++;
        resolve();
      } else {
        setTimeout(tryLock, 10); // Retry until write lock is free
      }
    };
    tryLock();
  });
}

// Release read lock
function releaseReadLock() {
  readers--;
}

// Write lock function
async function acquireWriteLock() {
  return new Promise((resolve) => {
    const tryLock = () => {
      if (!writeLock && readers === 0) {
        // Proceed if no readers or writers
        writeLock = true;
        resolve();
      } else {
        setTimeout(tryLock, 10); // Retry until no readers/writers
      }
    };
    tryLock();
  });
}

// Release write lock
function releaseWriteLock() {
  writeLock = false;
}

// Route to read counter (multiple readers allowed)
app.get("/read-counter", async (req, res) => {
  await acquireReadLock();
  console.log(`Reader accessed counter: ${counter}`);
  await delay(500); // Simulate longer read delay
  res.send(`Counter read value: ${counter}`);
  releaseReadLock();
});

// Route to increment counter (exclusive write access)
app.post("/increment-counter", async (req, res) => {
  await acquireWriteLock();
  counter++;
  console.log(`Writer incremented counter to: ${counter}`);
  res.send(`Counter incremented to: ${counter}`);
  releaseWriteLock();
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
