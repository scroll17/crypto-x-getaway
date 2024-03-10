export type AxiosErrorData = {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, unknown>;
  status?: {
    code: number;
    text: string;
  };
};
