import cron from "node-cron";

async function setupCronJobs() {
  try {
    console.log("Initializing cron jobs...");

    // Define o job para ser executado a cada 30 segundos
    cron.schedule("*/1 * * * * *", async () => {
      console.log(`Log message at ${new Date().toISOString()}`);
    });

    console.log("Cron job 'log-message' scheduled to run every 30 seconds");
  } catch (error) {
    console.error("Error setting up cron jobs:", error);
  }
}

export default setupCronJobs;
