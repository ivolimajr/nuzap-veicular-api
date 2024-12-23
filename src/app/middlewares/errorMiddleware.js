import { captureEvent } from "@sentry/node";

export default (error, req, res, next) => {
  console.error(error);
  if (error.response) error.data = error.response.data;
  captureEvent(error);
  res.status(error.status || 500).json(error);
};
