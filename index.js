import "./instrument.js";
const Sentry = require("@sentry/node");
import app from "./src/app.js";

Sentry.setupExpressErrorHandler(app);
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});
