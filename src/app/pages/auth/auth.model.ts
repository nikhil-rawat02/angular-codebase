export interface Auth {
}

export interface UserRoles {
  id: number;
  name: string;
}

export interface Privilege {
  id: number;
  name: string;
  displayName: string;
  selected: boolean;
  subPrivilegeId: number;
}

export interface AuthResponse {
  errorMessage: string;
  username: string;
  userId: number;
  token: string;
  tokenExpiry: Date;
  firstlogin: number;
  roles: UserRoles;
  privilegeList: Privilege[];
}

export enum UserRole {
  Student = "STUDENT",
  Instructor = "INSTRUCTOR",
  Admin = "ADMIN",
  APPO ="APPO"
}