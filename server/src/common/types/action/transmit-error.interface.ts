export interface IActionTransmitError<D extends Record<string, unknown>> {
  source: string;
  status: {
    code: number | null;
    text: string | null;
  };
  details:
    | {
        message: string;
        code?: string;
      }
    | {
        message: string;
        stack?: string;
      }
    | D;
}
