import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://3e228c8ccb48cea88041a835fec43753@o4508433190420480.ingest.us.sentry.io/4508433194483712",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  beforeSend(event) {
    if (process.env.NODE_ENV === "local") return null;
    return event;
  },
});

export default Sentry;
