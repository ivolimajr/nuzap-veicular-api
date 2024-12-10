import cron from "node-cron";
import EpsServices from "../domain/epsServices.js";

async function checkAllOrders() {
  try {
    const cronTime = process.env.CONSULTA_CRON_TIME;
    if (!cronTime) {
      console.error("No cron jobs enabled.");
      return null;
    }

    // Define o job para ser executado a cada 30 segundos
    cron.schedule(cronTime, async () => {
      console.info(
        `Initializing checkAllOrders job - ${cronTime} ...`,
      );
      await EpsServices.checkAllOrders();
    });
  } catch (error) {
    console.error("Error setting up cron jobs:", error);
  }
}

export default checkAllOrders;
