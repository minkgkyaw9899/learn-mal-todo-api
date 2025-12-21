export const successResponseFormatter = <T>(
  data: T,
  status: number = 200,
  message: string = "Success"
) => {
  return {
    meta: {
      status: status,
      message: message,
      isSuccess: true,
    },
    data,
  };
};

export const errorResponseFormatter = (
  status = 500,
  message: "Inter Server Error"
) => {
  return {
    meta: {
      status: status,
      message: message,
      isSuccess: false,
    },
    data: null,
  };
};
