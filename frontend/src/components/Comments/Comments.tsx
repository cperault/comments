import { useState } from "react";
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
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Comment,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useUpdateCommentMutation,
} from "../../redux/commentsApi";

type CommentTreeNode = Comment & { replies: CommentTreeNode[] };

export const Comments = () => {
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [replyId, setReplyId] = useState<number | null>(null);

  const { data: comments = [], isLoading: isLoadingComments } = useGetCommentsQuery();
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !author.trim()) return;

    try {
      await createComment({
        author,
        parent: "",
        text: newComment,
        image: "",
      }).unwrap();

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
      await updateComment({ id, text: editedText }).unwrap();
      setEditingId(null);
      setEditedText("");
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
      await deleteComment(id).unwrap();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReply = async (parentId: number, text: string) => {
    if (!text.trim()) return;

    try {
      await createComment({
        author,
        parent: String(parentId),
        text,
        image: "",
      }).unwrap();

      setReplyId(null);
      setNewComment("");
      setAuthor("");
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  const nestComments = (comments: Comment[]): CommentTreeNode[] => {
    const commentMap = new Map<number, CommentTreeNode>();

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    const allComments: CommentTreeNode[] = [];

    comments.forEach((comment) => {
      if (!comment.parent || comment.parent === "") {
        allComments.push(commentMap.get(comment.id)!);
      } else {
        const parentId = Number(comment.parent);
        const parentComment = commentMap.get(parentId);

        if (parentComment) {
          parentComment.replies.push(commentMap.get(comment.id)!);
        }
      }
    });

    return allComments;
  };

  const CommentItem = ({
    comment,
    onReply,
    depth = 0,
  }: {
    comment: CommentTreeNode;
    onReply: (parentId: number, text: string) => void;
    depth?: number;
  }) => {
    const [replyText, setReplyText] = useState("");

    return (
      <Card variant="outlined" sx={{ mb: 2, ml: depth * 4 }}>
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
                <IconButton color="success" onClick={() => handleSave(comment.id)}>
                  {isUpdatingComment ? (
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
              <IconButton color="default" onClick={() => handleEdit(comment.id, comment.text)}>
                <EditIcon />
              </IconButton>
            )}

            <IconButton color="error" onClick={() => handleDelete(comment.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          {replyId === comment.id ? (
            <Stack spacing={1} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                variant="outlined"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onReply(comment.id, replyText);
                  setReplyText("");
                }}
              >
                Reply
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setReplyId(null);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <IconButton
              color="default"
              onClick={() => {
                setReplyId(comment.id);
              }}
            >
              <ReplyIcon />
            </IconButton>
          )}
          {comment.replies.length > 0 && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    );
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
            disabled={!newComment.trim() || !author.trim() || isCreatingComment}
          >
            {isCreatingComment ? "Posting comment..." : "Post Comment"}
          </Button>
        </Stack>
      </form>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {isLoadingComments ? (
          <Typography color="textSecondary">Loading comments...</Typography>
        ) : (
          nestComments(comments).map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))
        )}
      </Stack>
    </Container>
  );
};
