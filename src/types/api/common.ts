export interface GenericAdminActionResponse {
  success: boolean;
  message?: string;
}

export type SuccessResponse<T> = {
  success: true;
  data: T;
};
