import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { getTeams, getTeamMembers } from '../../services/teamService';
import { getTasks } from '../../services/taskService';
import { Team, User, Task, TaskStatus } from '../../types';

const TeamView: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [memberTasks, setMemberTasks] = useState<{ [key: number]: Task[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (members.length > 0) {
      members.forEach(member => {
        fetchMemberTasks(member.id);
      });
    }
  }, [members]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeams();
      if (response.success) {
        setTeams(response.data);
        if (response.data.length > 0) {
          setSelectedTeam(response.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: number) => {
    try {
      const response = await getTeamMembers(teamId);
      if (response.success && response.data) {
        setMembers(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchMemberTasks = async (userId: number) => {
    try {
      // Get tasks where user is assignee
      const response = await getTasks(0, 100, undefined, undefined, userId);
      if (response.success) {
        setMemberTasks(prev => ({
          ...prev,
          [userId]: response.data.content,
        }));
      }
    } catch (err) {
      console.error(`Error fetching tasks for user ${userId}:`, err);
    }
  };

  const getMemberStats = (userId: number) => {
    const tasks = memberTasks[userId] || [];
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status === TaskStatus.DONE).length,
      inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
      todo: tasks.filter(task => task.status === TaskStatus.TODO).length,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Team View
      </Typography>

      {selectedTeam ? (
        <Box>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {selectedTeam.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedTeam.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {members.length} Members
            </Typography>
          </Paper>

          <Typography variant="h5" gutterBottom>
            Team Members
          </Typography>

          <Grid container spacing={3}>
            {members.map(member => {
              const stats = getMemberStats(member.id);
              const completionRate = stats.total > 0 
                ? Math.round((stats.completed / stats.total) * 100)
                : 0;

              return (
                <Grid size={{ xs: 12, md: 6 }} key={member.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {member.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{member.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" gutterBottom>
                        Task Progress
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Completion Rate:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {completionRate}%
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip
                          label={`${stats.total} Total`}
                          size="small"
                        />
                        <Chip
                          label={`${stats.todo} To Do`}
                          color="warning"
                          size="small"
                        />
                        <Chip
                          label={`${stats.inProgress} In Progress`}
                          color="info"
                          size="small"
                        />
                        <Chip
                          label={`${stats.completed} Completed`}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {members.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">No team members found.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No teams found.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default TeamView; 