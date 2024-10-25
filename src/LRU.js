const express = require("express");
const app = express();
const PORT = 3003;

// Middleware to parse JSON requests
app.use(express.json());

// LRUCache class definition
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Store the key-value pairs
  }

  get(key) {
    if (!this.cache.has(key)) {
      console.log(`Key ${key} not found in cache`);
      return null; // Return null if key not found
    }

    // Move the accessed key to the end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    console.log(`Accessed key ${key}: ${value}`);
    return value;
  }

  put(key, value) {
    // If key already exists, update the value and move it to the end
    if (this.cache.has(key)) {
      this.cache.delete(key);
      console.log(`Updated key ${key} with value ${value}`);
    } else {
      // If capacity is reached, remove the least recently used (first item)
      if (this.cache.size >= this.capacity) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
        console.log(`Evicted key ${firstKey}`);
      }
      console.log(`Added key ${key} with value ${value}`);
    }
    this.cache.set(key, value);
  }

  display() {
    console.log("Cache state:", Array.from(this.cache.entries()));
  }
}

// Initialize the LRUCache with a capacity
const cacheCapacity = 3; // Example capacity
const lruCache = new LRUCache(cacheCapacity);

// Define API routes
app.post("/cache", (req, res) => {
  const { key, value } = req.body;
  lruCache.put(key, value);
  lruCache.display();
  res.json({ message: `Key ${key} added/updated with value ${value}` });
});

app.get("/cache/:key", (req, res) => {
  const key = req.params.key;
  const value = lruCache.get(key);
  if (value === null) {
    return res.status(404).json({ message: `Key ${key} not found` });
  }
  res.json({ key, value });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
