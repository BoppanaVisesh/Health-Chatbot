"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { checkSymptoms } from "./actions";
import { AlertCircle, FileWarning, HeartPulse, Lightbulb, Upload, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : "Analyze Symptoms"}
    </Button>
  );
}

export default function SymptomCheckerPage() {
  const [state, formAction] = useFormState(checkSymptoms, {});
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Symptom Checker"
        description="Describe your symptoms, and our AI will provide potential causes and recommendations. This is not a substitute for professional medical advice."
      />
      <Card>
        <form action={formAction}>
          <input type="hidden" name="photoDataUri" value={photoDataUri || ""} />
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Optionally add a photo, then provide as much detail as possible, such as duration,
              severity, and any other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {photoDataUri ? (
              <div className="relative">
                <Image src={photoDataUri} alt="Symptom photo" width={400} height={300} className="rounded-md object-contain w-full" />
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
            <Textarea
              name="symptoms"
              placeholder="e.g., I have a persistent dry cough, a slight fever, and feel very tired..."
              rows={5}
              required
            />
            {state?.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state?.result && (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Analysis Results</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <HeartPulse className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle>Urgency Level</CardTitle>
                  <CardDescription>Our assessment of urgency.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{state.result.urgencyLevel}</p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <AlertCircle className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Potential Causes</CardTitle>
                    <CardDescription>Possible reasons for your symptoms.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{state.result.potentialCauses}</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Lightbulb className="h-8 w-8 text-accent-foreground" />
                 <div>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>Suggestions for your next steps.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{state.result.recommendedActions}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6 border-destructive/50 bg-destructive/10">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <FileWarning className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle>Disclaimer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive-foreground/80">
                  This AI-powered analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
