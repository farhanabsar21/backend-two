const express = require("express");
const app = express();
const PORT = 3000;

let counter = 0;
let isLocked = false;

// Helper function to simulate a lock
function lock() {
  return new Promise((resolve) => {
    const tryLock = () => {
      if (!isLocked) {
        isLocked = true;
        resolve();
      } else {
        setTimeout(tryLock, 1); // Retry if lock is taken
      }
    };
    tryLock();
  });
}

// Helper function to unlock
function unlock() {
  isLocked = false;
}

// Increment without lock
app.get("/increment-without-lock", (req, res) => {
  for (let i = 0; i < 1000; i++) {
    counter++;
  }
  res.send(`Counter incremented without lock. Current value: ${counter}`);
});

// Increment with lock
app.get("/increment-with-lock", async (req, res) => {
  await lock(); // Wait for lock
  for (let i = 0; i < 1000; i++) {
    counter++;
  }
  unlock(); // Release lock
  res.send(`Counter incremented with lock. Current value: ${counter}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Simulate multiple requests for testing
async function simulateRequests() {
  counter = 0; // Reset counter
  const requests = Array(10).fill(fetch("http://localhost:3000/increment-with-lock"));

  // Run concurrent requests
  await Promise.all(requests);
  console.log(`Final Counter with Lock: ${counter}`);

  counter = 0; // Reset counter
  const requestsNoLock = Array(10).fill(fetch("http://localhost:3000/increment-without-lock"));

  // Run concurrent requests without lock
  await Promise.all(requestsNoLock);
  console.log(`Final Counter without Lock: ${counter}`);
}

simulateRequests();
