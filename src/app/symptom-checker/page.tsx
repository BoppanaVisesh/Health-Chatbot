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
import { FadeIn, StaggeredList } from "@/components/ui/page-transition";
import { LoadingSpinner } from "@/components/ui/loading";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto btn-animate scale-hover">
      {pending ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Analyzing Symptoms...
        </div>
      ) : (
        "Analyze Symptoms"
      )}
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

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUri = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUri);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedDataUri = await compressImage(file);
        setPhotoDataUri(compressedDataUri);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original method
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoDataUri(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
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
      
      // Calculate compressed dimensions
      const maxWidth = 800;
      let { videoWidth, videoHeight } = video;
      if (videoWidth > maxWidth) {
        videoHeight = (videoHeight * maxWidth) / videoWidth;
        videoWidth = maxWidth;
      }
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, videoWidth, videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg', 0.8); // Compress to 80% quality
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
    <div className="space-y-8 w-full p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <PageHeader
          title="Symptom Checker"
          description="Describe your symptoms, and our AI will provide potential causes and recommendations. This is not a substitute for professional medical advice."
        />
      </FadeIn>
      
      <FadeIn delay={200}>
        <Card className="card-hover">
          <form action={formAction}>
            <input type="hidden" name="photoDataUri" value={photoDataUri || ""} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" />
                Describe Your Symptoms
              </CardTitle>
              <CardDescription>
                Optionally add a photo, then provide as much detail as possible, such as duration,
                severity, and any other relevant information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {photoDataUri ? (
                <FadeIn>
                  <div className="relative max-w-md mx-auto">
                    <Image src={photoDataUri} alt="Symptom photo" width={400} height={300} className="rounded-md object-contain w-full border transition-all duration-300 hover:shadow-lg" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 scale-hover" onClick={clearPhoto}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </FadeIn>
              ) : showCamera ? (
                <FadeIn>
                   <div className="space-y-4 max-w-md mx-auto">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted border slide-in-bottom" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    {hasCameraPermission === false && (
                       <Alert variant="destructive" className="animate-in slide-in-from-bottom-4">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access to use this feature. You might need to refresh the page and try again.
                          </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} disabled={!hasCameraPermission} className="flex-1 btn-animate">Capture Photo</Button>
                      <Button variant="outline" onClick={() => setShowCamera(false)} className="flex-1 btn-animate">Cancel</Button>
                    </div>
                  </div>
                </FadeIn>
              ) : (
                <FadeIn delay={100}>
                  <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                     <label htmlFor="file-upload" className="flex-1 cursor-pointer">
                      <Card className="flex flex-col items-center justify-center p-6 text-center h-full card-hover border-dashed">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2 transition-transform duration-200 group-hover:scale-110" />
                        <span className="font-semibold">Upload Image</span>
                        <span className="text-sm text-muted-foreground">Click here to select a file</span>
                      </Card>
                      <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                     </label>
                     <Card className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer card-hover border-dashed group" onClick={enableCamera}>
                        <Camera className="h-8 w-8 text-muted-foreground mb-2 transition-transform duration-200 group-hover:scale-110" />
                        <span className="font-semibold">Use Camera</span>
                        <span className="text-sm text-muted-foreground">Capture a photo directly</span>
                    </Card>
                  </div>
                </FadeIn>
              )}
              <FadeIn delay={300}>
                <Textarea
                  name="symptoms"
                  placeholder="e.g., I have a persistent dry cough, a slight fever, and feel very tired..."
                  rows={5}
                  required
                  className="resize-none focus-ring transition-all duration-200"
                />
              </FadeIn>
              {state?.error && (
                <p className="mt-2 text-sm text-destructive text-center animate-in slide-in-from-bottom-2">{state.error}</p>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <FadeIn delay={400}>
                <SubmitButton />
              </FadeIn>
            </CardFooter>
          </form>
        </Card>
      </FadeIn>

      {state?.result && (
        <FadeIn delay={300}>
          <div className="space-y-6">
              <h2 className="text-2xl font-bold font-headline gradient-text">Analysis Results</h2>
            <StaggeredList staggerDelay={150} className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-1 card-hover">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <HeartPulse className="h-8 w-8 text-destructive shrink-0 transition-transform duration-200 hover:scale-110" />
                  <div>
                    <CardTitle>Urgency Level</CardTitle>
                    <CardDescription>Our assessment of urgency.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{state.result.urgencyLevel}</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-1 lg:col-span-2 card-hover">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <AlertCircle className="h-8 w-8 text-primary shrink-0 transition-transform duration-200 hover:scale-110" />
                  <div>
                      <CardTitle>Potential Causes</CardTitle>
                      <CardDescription>Possible reasons for your symptoms.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p>{state.result.potentialCauses}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 lg:col-span-3 card-hover">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Lightbulb className="h-8 w-8 text-accent-foreground shrink-0 transition-transform duration-200 hover:scale-110" />
                   <div>
                      <CardTitle>Recommended Actions</CardTitle>
                      <CardDescription>Suggestions for your next steps.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p>{state.result.recommendedActions}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggeredList>
            <FadeIn delay={600}>
              <Card className="mt-6 border-destructive/50 bg-destructive/10 card-hover">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <FileWarning className="h-8 w-8 text-destructive shrink-0 transition-transform duration-200 hover:scale-110" />
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
            </FadeIn>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
