import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";

interface Comment {
  id: number;
  author: string;
  text: string;
  created_at: string;
  likes: number;
  image?: string;
}

export const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments");

        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();

        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !author.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text: newComment, image: "" }),
      });

      setIsSubmitting(false);

      if (!response.ok) throw new Error("Failed to create comment");

      const newCommentData = await response.json();

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
      setAuthor("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };

  const handleSave = async (id: number) => {
    if (!editedText.trim()) return;

    try {
      setIsSaving(true);

      const response = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedText }),
      });

      setIsSaving(false);

      if (!response.ok) throw new Error("Failed to update comment");

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, text: editedText } : comment
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedText("");
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/comments/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Comments
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            disabled={!newComment.trim() || !author.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting comment..." : "Post Comment"}
          </Button>
        </Stack>
      </form>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {comments.length === 0 ? (
          <Typography color="textSecondary">Loading comments...</Typography>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} variant="outlined">
              <CardHeader
                avatar={
                  comment.image ? (
                    <Avatar src={comment.image} />
                  ) : (
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  )
                }
                title={comment.author}
                subheader={new Date(comment.created_at).toLocaleString()}
              />
              <CardContent>
                {editingId === comment.id ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    variant="outlined"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">{comment.text}</Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: "flex-end" }}>
                  <IconButton color="primary">
                    <Stack direction="row" spacing={1}>
                      <ThumbUpIcon />
                      <Typography variant="body1">{comment.likes}</Typography>
                    </Stack>
                  </IconButton>

                  {editingId === comment.id ? (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleSave(comment.id)}
                      >
                        {isSaving ? (
                          <Stack direction="row" spacing={1}>
                            <SaveIcon />
                            <Typography>Saving...</Typography>
                          </Stack>
                        ) : (
                          <SaveIcon />
                        )}
                      </IconButton>
                      <IconButton color="warning" onClick={handleCancel}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      color="default"
                      onClick={() => handleEdit(comment.id, comment.text)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};
