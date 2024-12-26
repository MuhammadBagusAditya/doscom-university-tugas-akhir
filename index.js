import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.yml";

import config from "@config";
import routes from "@routes";
import * as errors from "@middlewares/errors";
import { dirname } from "@utils/path";
import path from "path";

const app = express();

app.use(morgan("short"));

app.use([express.json(), express.urlencoded({ extended: true })]);

app.use(
  "/storage",
  express.static(path.join(dirname(import.meta.url), "storage"))
);

// try {
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// } catch (e) {
// console.log("Failed to serve docs");
// }

app.use("/api", routes);

app.use(errors.error);

app.use(errors.notFound);

if (process.env.NODE_ENV !== "development") {
  app.listen(config.app.port, () => {
    console.log("Server started");
  });
}

export const viteApp = app;
