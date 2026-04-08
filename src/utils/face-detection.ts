import * as faceapi from 'face-api.js';

/**
 * Загрузка необходимых моделей.
 * Путь '/models' соответствует папке public/models в Next.js.
 */
export const loadModels = async () => {
  const MODEL_URL = '/models';
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // для детекции лиц
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // для поиска ключевых точек
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL), // для создания дескрипторов (идентификации)
    ]);
    console.log('Face-api models loaded');
  } catch (error) {
    console.error('Error loading face-api models:', error);
  }
};

/**
 * Проверка кадра на наличие ровно одного лица.
 * @param input Изображение, видео или canvas
 */
export const validateSingleFace = async (input: faceapi.TNetInput) => {
  const detections = await faceapi.detectAllFaces(input);

  if (detections.length === 0) {
    return { status: 'no_face', message: 'Человек не обнаружен' };
  }

  if (detections.length > 1) {
    return { status: 'multiple_faces', message: 'Обнаружено более одного лица' };
  }

  return { status: 'success', detection: detections[0] };
};

/**
 * Получение дескриптора лица (уникальный отпечаток для сравнения)
 */
export const getFaceDescriptor = async (input: faceapi.TNetInput) => {
  const detection = await faceapi
    .detectSingleFace(input)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection ? detection.descriptor : null;
};

/**
 * Сравнение двух лиц
 * @param descriptor1 Дескриптор из эталонного фото
 * @param descriptor2 Дескриптор из текущего кадра
 * @param threshold Порог схожести (чем меньше, тем строже)
 */
export const compareFaces = (
  descriptor1: Float32Array,
  descriptor2: Float32Array,
  threshold = 0.6
) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return {
    isMatch: distance < threshold,
    distance
  };
};
