export type Response = {
  statusCode: number;
  headers: {
    [key: string]: any;
  };
  body: string;
};
