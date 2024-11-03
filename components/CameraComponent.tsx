'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type CameraComponentProps = {
    closeCamera: (image: string) => void
}
export default function CameraComponent({closeCamera}: CameraComponentProps) {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            // width: { min: 1280, ideal: 1920, max: 2560 },
            // height: { min: 720, ideal: 1080, max: 1440 },
            facingMode: 'environment'
          }
        });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    } else {
      alert("Camera access is not supported on this device or browser.");
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
    startCamera()
  }, [])
  console.log(videoStream);
  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      
      {videoStream && (
        <div className="absolute h-full w-full">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-screen h-screen object-cover"
          />
          <button 
            onClick={capturePhoto} 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg bg-blue-500 text-white">
            Take Photo
          </button>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />

      {capturedImage && (
        <div className="absolute bottom-0 mb-8 text-center bg-black bg-opacity-50 p-4 rounded-lg">
          <h2 className="text-white">Foto capturada:</h2>
          <button className='text-white' onClick={() => closeCamera(capturedImage)}>Aceitar</button>
          <Image src={capturedImage} alt="Captured" width={300} height={200} className="rounded-lg" />
        </div>
      )}
    </div>
  );
}
