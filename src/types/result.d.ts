type successResult = {
  success: true;
  message: string;
};

type errorResult<E = Error> = {
  success: false;
  message: string;
  error?: E;
};

export type Result<E = Error> = successResult | errorResult<E>;
