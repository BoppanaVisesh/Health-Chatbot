"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode.react";
import { PageHeader } from '@/components/page-header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMedicationInfo } from "./actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, BookOpen, Camera, Upload, X, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Get Information"}
    </Button>
  );
}

export default function MedicationPage() {
  const [state, formAction] = useFormState(getMedicationInfo, {});
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Stop camera stream when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const enableCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setPhotoDataUri(dataUri);
      setShowCamera(false);
       if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const clearPhoto = () => {
    setPhotoDataUri(null);
  }
  
  const qrCodeValue = state?.result ? `Medication: ${state.result.medicationName}\n\nExplanation: ${state.result.explanation}` : "";


  return (
    <div className="space-y-8">
      <PageHeader
        title="Medication Information"
        description="Upload or take a picture of a medication or prescription to get a detailed explanation. This is for educational purposes only."
      />

      <Card>
        <form action={formAction}>
          <input type="hidden" name="photoDataUri" value={photoDataUri || ""} />
          <CardHeader>
            <CardTitle>Prescription Analyzer</CardTitle>
            <CardDescription>
              Upload an image or use your camera to capture a photo of the medication label or prescription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {photoDataUri ? (
              <div className="relative">
                <Image src={photoDataUri} alt="Prescription" width={400} height={300} className="rounded-md object-contain w-full" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearPhoto}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : showCamera ? (
               <div className="space-y-2">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {hasCameraPermission === false && (
                   <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature. You might need to refresh the page and try again.
                      </AlertDescription>
                    </Alert>
                )}
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} disabled={!hasCameraPermission}>Capture Photo</Button>
                  <Button variant="outline" onClick={() => setShowCamera(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                 <label htmlFor="file-upload" className="flex-1 cursor-pointer">
                  <Card className="flex flex-col items-center justify-center p-6 text-center h-full hover:bg-accent/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="font-semibold">Upload Image</span>
                    <span className="text-sm text-muted-foreground">Click here to select a file</span>
                  </Card>
                  <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                 </label>
                 <Card className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors" onClick={enableCamera}>
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="font-semibold">Use Camera</span>
                    <span className="text-sm text-muted-foreground">Capture a photo directly</span>
                </Card>
              </div>
            )}
            
            {state?.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state?.result && state.result.medicationName && (
        <Card>
           <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                 <BookOpen className="h-6 w-6 text-primary" />
                 <CardTitle>Explanation for {state.result.medicationName}</CardTitle>
              </div>
               <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Medication QR Code</DialogTitle>
                    <DialogDescription>
                      Scan this QR code with your phone to save the medication details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center p-4">
                    <QRCode value={qrCodeValue} size={256} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <p className="font-semibold">MediAI Pharmacist</p>
                <p className="text-muted-foreground">{state.result.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
