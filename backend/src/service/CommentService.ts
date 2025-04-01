import { Database } from "../db";

const database = new Database();

export class CommentService {
  public async getAllComments() {
    const isConnected = await database.checkConnection();

    if (!isConnected) {
      throw new Error("The database is not connected.");
    }

    const result = await database.query(
      "SELECT * FROM comments ORDER BY created_at DESC",
      []
    );

    if (result.rowCount === 0) {
      return { message: "No comments found" };
    }

    return result.rows;
  }

  public async createComment({
    author,
    text,
    image,
  }: {
    author: string;
    text: string;
    image: string;
  }) {
    const isConnected = await database.checkConnection();

    if (!isConnected) {
      throw new Error("The database is not connected.");
    }

    const now = new Date();
    const currentTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString();

    const result = await database.query(
      "INSERT INTO comments (author, text, image, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [author, text, image, currentTime]
    );

    return result.rows[0];
  }

  public async updateComment({ id, text }: { id: number; text: string }) {
    const isConnected = await database.checkConnection();

    if (!isConnected) {
      throw new Error("The database is not connected.");
    }

    const result = await database.query(
      "UPDATE comments SET text = $1 WHERE id = $2 RETURNING *",
      [text, id]
    );

    if (result.rowCount === 0) {
      throw new Error("Comment not found");
    }

    return { message: "Comment updated successfully", comment: result.rows[0] };
  }

  public async deleteComment(id: number) {
    const isConnected = await database.checkConnection();

    if (!isConnected) {
      throw new Error("The database is not connected.");
    }

    await database.query("DELETE FROM comments WHERE id = $1", [id]);

    return { message: "Comment deleted successfully" };
  }
}
