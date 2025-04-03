import { CommentController } from "../../controller/CommentController.ts";
import { CommentService } from "../../service/CommentService.ts";
import { BaseRouter } from "../BaseRouter.ts";

export class CommentsRouter extends BaseRouter {
  private commentController: CommentController;

  constructor(commentService: CommentService) {
    super();
    this.commentController = new CommentController(commentService);
  }

  protected initalizeRoutes(): void {
    this.router.get("/", this.commentController.getAllComments.bind(this.commentController));
    this.router.post("/", this.commentController.createComment.bind(this.commentController));
    this.router.put("/:id", this.commentController.updateComment.bind(this.commentController));
    this.router.delete("/:id", this.commentController.deleteComment.bind(this.commentController));
  }
}
