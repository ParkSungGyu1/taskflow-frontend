import { Team, User, CreateTeamRequest, UpdateTeamRequest, AddMemberRequest } from '../types';
import { get, post, put, del } from './api';
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

export const createTeam = async (request: CreateTeamRequest) => {
  if (useMock) {
    return mockTeamService.createTeam(request);
  }
  return post<Team>('/teams', request);
};

export const updateTeam = async (id: number, request: UpdateTeamRequest) => {
  if (useMock) {
    return mockTeamService.updateTeam(id, request);
  }
  return put<Team>(`/teams/${id}`, request);
};

export const deleteTeam = async (id: number) => {
  if (useMock) {
    return mockTeamService.deleteTeam(id);
  }
  return del(`/teams/${id}`);
};

export const addTeamMember = async (teamId: number, request: AddMemberRequest) => {
  if (useMock) {
    return mockTeamService.addMember(teamId, request);
  }
  return post<Team>(`/teams/${teamId}/members`, request);
};

export const removeTeamMember = async (teamId: number, userId: number) => {
  if (useMock) {
    return mockTeamService.removeMember(teamId, userId);
  }
  return del(`/teams/${teamId}/members/${userId}`);
};

export const getAvailableUsers = async (teamId?: number) => {
  if (useMock) {
    return mockTeamService.getAvailableUsers(teamId);
  }
  return get<User[]>(`/users/available${teamId ? `?teamId=${teamId}` : ''}`);
}; 