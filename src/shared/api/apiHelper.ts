export const apiRequest = async (request: any) => {
  try {
    const res = await request;

    if (res?.data?.success === false) {
      throw new Error(res.data?.message || "Business error");
    }

    return res.data;
  } catch (error: any) {
    console.log('raw error', error);

    // 1. Проверяем, что error — объект
    if (!error || typeof error !== 'object') {
      const err = new Error("Неизвестная ошибка");

      (err as any).status = 0;
      (err as any).type = "unknown";
      throw err;
    }

    // 2. Получаем сообщение безопасно
    const message = String(error?.response?.data?.message || error?.message || "Проблема с сетью");

    const err = new Error(message);

    (err as any).status = error?.response?.status || 0;
    (err as any).type = error?.response ? "server" : "network";

    throw err;
  }
};
