'use client';

import { ImagePlusIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type CameraComponentProps = {
  getImage: (image: string) => void;
  close: () => void;
};

export default function CameraComponent({
  getImage,
  close,
}: CameraComponentProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (
      typeof window !== 'undefined' &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'environment',
            },
          })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            } else {
              alert('deu b.o');
            }
          })
          .catch((error) => {
            console.error('Erro ao acessar a câmera:', error);
          });
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
    startCamera();
    document.body.style.overflow = 'hidden';
    verifyPermission()
  }, []);

  const verifyPermission = async () => {
    const permissionStatus = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    });
    if(permissionStatus.state === "granted"){
   
    }
   return permissionStatus.state
  }

  return  (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="h-full w-full absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
        <X
          className="absolute top-2 right-2  text-red-600"
          onClick={() => {
            close();
          }}
          size={34}
        />

        <button
          className=" absolute bottom-4 left-2/4 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-gray-300 focus:outline-none active:bg-gray-200"
          onClick={capturePhoto}
        >
          <div className="absolute inset-0 m-2 rounded-full bg-gray-100"></div>
        </button>

        <label
          htmlFor="image"
          className="absolute bottom-6 left-3/4 text-white"
        >
          <ImagePlusIcon size={40} className='cursor-pointer' />
        </label>
        <input
          className="hidden"
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const dataUrl = reader.result;
                  setCapturedImage(String(dataUrl));
                };
                reader.readAsDataURL(file);
              }
            }
          }}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
      {capturedImage && (
        <div className="absolute inset-0 flex flex-col  justify-center bg-black bg-opacity-50 p-4">
          <h2 className="text-white">Foto capturada:</h2>
          <Image
            src={capturedImage}
            alt="Captured"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', maxHeight: '500px' }}
            className="rounded-lg object-cover"
          />
          <div className="flex items-center justify-around mt-2">
            <button
              className="flex items-center py-2 px-6 rounded-lg text-white font-bold bg-red-600"
              onClick={() => setCapturedImage('')}
            >
              Cancelar
            </button>

            <button
              className="flex items-center py-2 px-6 rounded-lg text-white font-bold bg-green-600"
              onClick={() => getImage(capturedImage)}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
