import { Request, Response } from "express";
import { CommentService } from "../service/CommentService";

export class CommentController {
  constructor(private commentService: CommentService) {}

  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await this.commentService.getAllComments();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  async createComment(req: Request, res: Response) {
    const { author, parent, text, image } = req.body;

    try {
      const comment = await this.commentService.createComment({
        author,
        parent,
        text,
        image,
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  }

  async updateComment(req: Request, res: Response) {
    const { id } = req.params;
    const { text } = req.body;

    try {
      const result = await this.commentService.updateComment({
        id: Number(id),
        text,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update comment" });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await this.commentService.deleteComment(Number(id));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
}
