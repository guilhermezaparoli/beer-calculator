'use client'
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function CameraComponent() {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440
            },
            facingMode: 'environment'
        }  });
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
      // Clean up the video stream when the component unmounts
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream]);

  return (
    <div>
      <button onClick={startCamera}>Open Camera</button>
      <div>
        {videoStream && (
          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '300px' }} />
            <button onClick={capturePhoto}>Take Photo</button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {capturedImage && (
          <div>
            <h2>Captured Photo:</h2>
            <Image src={capturedImage} alt="Captured" />
          </div>
        )}
      </div>
    </div>
  );
}
