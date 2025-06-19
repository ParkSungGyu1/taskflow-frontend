import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  IconButton,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getTaskById, updateTask, updateTaskStatus, deleteTask } from '../../services/taskService';
import { getTaskComments, createComment, deleteComment } from '../../services/commentService';
import { getUsers } from '../../services/authService';
import { Task, Comment, TaskStatus, TaskPriority, User, CreateCommentRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';

const priorityColors = {
  [TaskPriority.LOW]: 'success',
  [TaskPriority.MEDIUM]: 'warning',
  [TaskPriority.HIGH]: 'error',
};

const statusColors = {
  [TaskStatus.TODO]: 'warning',
  [TaskStatus.IN_PROGRESS]: 'info',
  [TaskStatus.DONE]: 'success',
};

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = parseInt(id || '0');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    if (taskId) {
      fetchTaskData();
      fetchUsers();
    }
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const taskResponse = await getTaskById(taskId);
      const commentsResponse = await getTaskComments(taskId);
      
      if (taskResponse.success) {
        setTask(taskResponse.data);
      }
      
      if (commentsResponse.success) {
        setComments(commentsResponse.data.content);
      }
    } catch (err) {
      console.error('Error fetching task data:', err);
      setError('Failed to load task data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    
    try {
      const response = await updateTaskStatus(taskId, newStatus);
      if (response.success) {
        setTask({ ...task, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user) return;
    
    try {
      const commentRequest: CreateCommentRequest = {
        content: commentText,
      };
      
      const response = await createComment(taskId, commentRequest);
      if (response.success && response.data) {
        // Add the new comment to the list
        const newComment: Comment = response.data;
        setComments([...comments, newComment]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await deleteComment(taskId, commentId);
      if (response.success) {
        // Remove the comment from the list
        setComments(comments.filter(comment => comment.id !== commentId));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleOpenEditDialog = () => {
    if (!task) return;
    
    setEditedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assigneeId: task.assignee?.id || task.assigneeId,
      dueDate: task.dueDate,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name as string]: value,
    });
  };

  const handleSaveTask = async () => {
    if (!editedTask) return;
    
    try {
      const response = await updateTask(taskId, {
        ...editedTask,
        dueDate: editedTask.dueDate ? editedTask.dueDate.replace('Z', '') : editedTask.dueDate
      });
      
      if (response.success && response.data) {
        setTask(response.data);
        handleCloseEditDialog();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error || 'Task not found'}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/tasks')}
          sx={{ mb: 2 }}
        >
          Back to Tasks
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {task.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={task.status} 
                color={statusColors[task.status] as any} 
              />
              <Chip 
                label={task.priority} 
                color={priorityColors[task.priority] as any} 
              />
              <Chip 
                label={`Due: ${format(new Date(task.dueDate), 'PP')}`} 
              />
            </Box>
          </Box>
          <Box>
            <IconButton onClick={handleOpenEditDialog} color="primary" sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDeleteTask} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {task.description || 'No description provided.'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <List>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {comment.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">
                              {comment.user?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(comment.createdAt), 'PP p')}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 1, whiteSpace: 'pre-line' }}
                          >
                            {comment.content}
                          </Typography>
                        }
                      />
                      {user && comment.userId === user.id && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No comments yet. Be the first to add a comment!
                </Typography>
              )}
            </List>

            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                multiline
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2, alignSelf: 'flex-end' }}
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                endIcon={<SendIcon />}
              >
                Post
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                >
                  <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assignee
              </Typography>
              <Typography variant="body1">
                {task.assignee?.name || 'Unassigned'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Due Date
              </Typography>
              <Typography variant="body1">
                {format(new Date(task.dueDate), 'PP')}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Created
              </Typography>
              <Typography variant="body1">
                {format(new Date(task.createdAt), 'PP')}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body1">
                {format(new Date(task.updatedAt), 'PP p')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Task Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={editedTask.title || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={editedTask.description || ''}
              onChange={handleInputChange}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={editedTask.priority || TaskPriority.MEDIUM}
                    label="Priority"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange({
                        target: {
                          name: 'priority',
                          value
                        }
                      } as any);
                    }}
                  >
                    <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                    <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                    <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Assignee</InputLabel>
                  <Select
                    name="assigneeId"
                    value={editedTask.assigneeId || 0}
                    label="Assignee"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange({
                        target: {
                          name: 'assigneeId',
                          value
                        }
                      } as any);
                    }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="datetime-local"
                  value={editedTask.dueDate ? editedTask.dueDate.substring(0, 16) : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    // Format: "2025-06-18T03:12:00" without 'Z' suffix
                    const formattedDate = dateValue ? `${dateValue}:00` : '';
                    handleInputChange({
                      target: {
                        name: 'dueDate',
                        value: formattedDate
                      }
                    } as any);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetail; 