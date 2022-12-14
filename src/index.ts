import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import * as cors from "cors";
// import * as dsAccessToken from "ds-access-tokens"
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors("*"));
    // app.use(dsAccessToken)

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    app.get("/", (request: Request, response: Response) => {
      response.json({
        msg: "App listening",
      });
    });

    // start express server
    app.listen(process.env.PORT);

    console.log("App listening on port " + process.env.PORT);
  })
  .catch((error) => console.log(error));
