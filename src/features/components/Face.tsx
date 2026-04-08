'use client'

import { useEffect, useRef, useState } from 'react'

import * as faceapi from 'face-api.js'

export default function Face() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [facesDetected, setFacesDetected] = useState(0)
  const [descriptor, setDescriptor] = useState<number[] | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<string>('') // результат сравнения

  // 1️⃣ Загрузка моделей и запуск видео
  useEffect(() => {
    const loadModelsAndVideo = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')

        setLoading(false)

        // запуск вебкамеры
        if (videoRef.current) {

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } catch (err) {
        console.error('Ошибка загрузки моделей или доступа к камере:', err)
      }
    }
    // loadModelsAndVideo();
  }, [])

  // 2️⃣ Загрузка фото и создание дескриптора
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setImageURL(url)

    const img = new Image()
    img.src = url
    await new Promise((resolve) => { img.onload = resolve })

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      alert('Лицо не найдено на фото!')
      return
    }

    setDescriptor(Array.from(detection.descriptor))
    setMatchResult('') // сбрасываем результат при новой загрузке
    console.log('Дескриптор лица:', detection.descriptor)
  }

  // 3️⃣ Сравнение лица с вебкамерой
  useEffect(() => {
    if (!descriptor || !videoRef.current) return
    let intervalId: NodeJS.Timer

    const faceMatcher = new faceapi.FaceMatcher(
      new faceapi.LabeledFaceDescriptors('UploadedFace', [new Float32Array(descriptor)]),
      0.6
    )

    intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(videoRef.current!)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detections) {
        setFacesDetected(0)
        setMatchResult('Лицо не найдено на видео')
        return
      }

      setFacesDetected(1)

      const bestMatch = faceMatcher.findBestMatch(detections.descriptor)
      setMatchResult(bestMatch.label === 'unknown' ? 'Не совпадает' : 'Совпадает!')
    }, 1000)

    return () => clearInterval(intervalId)
  }, [descriptor])

  return (
    <div>
      <h2>Face Recognition Demo</h2>
      {loading ? <p>Загрузка модели...</p> : <p>Модель загружена!</p>}

      <video
        ref={videoRef}
        width={480}
        height={360}
        style={{ border: '1px solid black', marginBottom: 10 }}
        autoPlay
        muted
      />
      <p>Лицо в кадре: {facesDetected}</p>
      <p>Результат сравнения: {matchResult}</p>

      <hr />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageURL && <img src={imageURL} alt="uploaded" width={200} />}
    </div>
  )
}
