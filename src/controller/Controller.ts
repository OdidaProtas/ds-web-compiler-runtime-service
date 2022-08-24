import { NextFunction, Request, Response } from "express";

import * as fs from "node:fs";
import * as path from "node:path";

import makeExt from "../util/makeExt";
import makeid from "../util/makeID";

var spawn = require("child_process").spawn;

export class Controller {
  async exec(request: Request, response: Response, next: NextFunction) {
    const fileID = makeid();
    const language = request.params.language;
    const ext = makeExt(language);
    const code = request.body.code;

    if (language !== "java")
      fs.appendFile(__dirname + `/temp/${fileID}.${ext}`, code, function (err) {
        if (err) {
          response.status(403);
          response.send({
            msg: "an error occurred",
            err
          });
        }
      });

    if (language === "javascript") {
      var process = spawn("node", [__dirname + `/temp/${fileID}.${ext}`]);

      process.stdout.on("data", function (data) {
        response.send(data.toString());
      });
    }

    if (language === "python") {
      var process = spawn("python", [__dirname + `/temp/${fileID}.${ext}`]);

      process.stdout.on("data", function (data) {
        response.send(data.toString());
      });
    }

    if (language === "java") {
      fs.mkdir(path.join(__dirname + "/temp/", fileID), (err) => {
        if (err) {
          response.status(403);
          response.send({
            msg: "an error occurred",
          });
        }

        fs.appendFile(
          __dirname + `/temp/${fileID}/App.java`,
          code,
          function (err) {
            if (err) {
              response.status(403);
              response.send({
                msg: "an error occurred",
              });
            }

            var process = spawn("javac", [
              __dirname + `/temp/${fileID}/App.java`,
            ]);
            var process = spawn("java", [__dirname + `/temp/${fileID}/App`]);

            process.stdout.on("data", function (data: any) {
              response.send(data.toString());
            });
          }
        );
      });
    }
  }
}
