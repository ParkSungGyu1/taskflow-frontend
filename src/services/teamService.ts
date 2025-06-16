import { Team, User } from '../types';
import { get } from './api';
import { mockTeamService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = false;

// Team Service API
export const getTeams = async () => {
  if (useMock) {
    return mockTeamService.getTeams();
  }
  return get<Team[]>('/teams');
};

export const getTeamById = async (id: number) => {
  if (useMock) {
    return mockTeamService.getTeamById(id);
  }
  return get<Team>(`/teams/${id}`);
};

export const getTeamMembers = async (teamId: number) => {
  if (useMock) {
    return mockTeamService.getTeamMembers(teamId);
  }
  return get<User[]>(`/teams/${teamId}/members`);
}; 