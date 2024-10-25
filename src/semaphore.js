const express = require("express");
const app = express();
const PORT = 3002;

// Job structure representing a task that needs to be processed
class Job {
  constructor(id) {
    this.id = id;
  }
}

// Worker function processes a job and simulates work with a timeout
async function worker(job) {
  console.log(`Processing job ID: ${job.id}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate some processing time
  console.log(`Job ID: ${job.id} processed`);
}

// Process the queue with a limited number of workers
async function processQueue(jobs, maxWorkers) {
  const promises = [];
  const jobQueue = [...jobs]; // Clone the jobs array

  while (jobQueue.length > 0) {
    const activeWorkers = promises.length;

    // If we have space for more workers, start processing the next job
    if (activeWorkers < maxWorkers) {
      const job = jobQueue.shift(); // Get the next job from the queue
      const jobPromise = worker(job);
      promises.push(jobPromise);

      // Remove the promise from the array once it's resolved
      jobPromise.finally(() => {
        const index = promises.indexOf(jobPromise);
        if (index > -1) {
          promises.splice(index, 1);
        }
      });
    }

    // Wait a short time before checking the job queue again
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Wait for all jobs to finish
  await Promise.all(promises);
}

// Simulated job queue
const jobs = Array.from({ length: 10 }, (_, i) => new Job(i + 1));

// Set max number of workers (concurrent job processors)
const maxWorkers = 3;

// Endpoint to start processing jobs
app.get("/process-jobs", async (req, res) => {
  console.log("Starting to process the job queue...");
  await processQueue(jobs, maxWorkers);
  console.log("All jobs have been processed.");
  res.send("All jobs have been processed.");
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
