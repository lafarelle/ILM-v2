export interface BaseActionResponse {
  success: boolean;
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export interface DeletePostResponse extends BaseActionResponse {
  error?: string;
}

export interface ReportPostResponse extends BaseActionResponse {
  error?: string;
}

export interface PostOwnershipResponse {
  isOwner: boolean;
  isAuthenticated: boolean;
  userId?: string;
}