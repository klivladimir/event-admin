export interface GenericAdminActionResponse {
  success: boolean;
  message?: string;
}

export type SuccessResponse<T> = {
  success: boolean;
  data: T;
};

export type ErrorResponse = {
  success: boolean;
  errors: Record<string, string>;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
