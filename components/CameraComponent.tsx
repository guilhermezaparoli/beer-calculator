import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type CameraComponentProps = {
  getImage: (image: string) => void;
  close: () => void
};

export default function CameraComponent({ getImage, close }: CameraComponentProps) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {ideal: "environment"},
            width: {
              ideal: 1080,
            },
            height: {
              ideal: 720
            }
          },
        });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    } else {
      alert('Camera access is not supported on this device or browser.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  useEffect(() => {
    startCamera();
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {videoStream && (
        <div className="h-full w-full absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => {
              close()
              document.body.style.overflow = 'auto';
            }}
            className="absolute bottom-4 left-1/4 transform -translate-x-1/2 text-white bg-green-500 p-2">
            Fechar
          </button>
          <button
            onClick={capturePhoto}
            className="absolute bottom-4 left-3/4 transform -translate-x-1/2 text-white bg-green-500 p-2">
            Tirar foto
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      {capturedImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4 rounded-lg">
          <h2 className="text-white">Foto capturada:</h2>
          <button className="text-white" onClick={() => getImage(capturedImage)}>
            Aceitar
          </button>
          <button className="text-red-600" onClick={() => setCapturedImage('')}>
            Recusar
          </button>
          <Image src={capturedImage} alt="Captured" width={300} height={200} className="rounded-lg" />
        </div>
      )}
    </div>
  );
}
