import { Controller } from "./controller/Controller";

export const Routes = [
  {
    method: "post",
    route: "/exec/:language",
    controller: Controller,
    action: "exec",
  },
];
