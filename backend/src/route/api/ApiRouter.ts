import { CommentService } from "../../service/CommentService.ts";
import { BaseRouter } from "../BaseRouter.ts";
import { CommentsRouter } from "../comments/CommentsRouter.ts";

export class ApiRouter extends BaseRouter {
  constructor(private commmentService: CommentService) {
    super();
  }

  protected initalizeRoutes(): void {
    const commentsRouter = new CommentsRouter(this.commmentService);
    this.router.use("/comments", commentsRouter.getRouter());
  }
}
