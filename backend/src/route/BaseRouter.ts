import { Router } from "express";

export abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initalizeRoutes(): void;

  public getRouter(): Router {
    this.initalizeRoutes();
    return this.router;
  }
}
