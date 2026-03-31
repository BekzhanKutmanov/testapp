// shared/api/apiRequest.js
export const apiRequest = async (request: any) => {
  // console.log(await request);
  try {
    const res = await request;

    // бизнес ошибка
    if (res?.data?.success === false) {
      throw {
        message: res.data?.message || "Business error",
        status: 400,
        type: "business",
      };
    }

    return res.data;
  } catch (error:any) {
    throw {
      message:
        error.response?.data?.message ||
        "Проблема с сетью",
      status: error.response?.status || 0,
      type: error.response ? "server" : "network",
    };
  }
};
