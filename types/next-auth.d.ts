import { UserRole } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

export interface UserAssignedTeam {
  id: string;
  code: string;
  name: string;
  role?: string | null;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string | null;
      role: UserRole;
      biroId: string;
      biroCode?: string;
      biroName?: string;
      teamId?: string | null;
      teamCode?: string | null;
      teamName?: string | null;
      assignedTeams?: UserAssignedTeam[];
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    username?: string | null;
    role?: UserRole;
    biroId?: string;
    biroCode?: string;
    biroName?: string;
    teamId?: string | null;
    teamCode?: string | null;
    teamName?: string | null;
    assignedTeams?: UserAssignedTeam[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string | null;
    role?: UserRole;
    biroId?: string;
    biroCode?: string;
    biroName?: string;
    teamId?: string | null;
    teamCode?: string | null;
    teamName?: string | null;
    assignedTeams?: UserAssignedTeam[];
  }
}
