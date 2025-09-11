import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Car, MapPin } from 'lucide-react';

export default function HospitalsPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'hospital-map');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Find Nearby Hospitals"
        description="Locate hospitals and clinics near you. The data shown is for demonstration purposes."
      />

      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {mapImage && (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-cover"
                data-ai-hint={mapImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-bold text-white">(Map integration requires API key)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {hospitals.map((hospital) => (
          <Card key={hospital.name}>
            <CardHeader>
              <CardTitle className="font-headline">{hospital.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Car className="h-4 w-4 shrink-0" />
                <span>
                  {hospital.distance} away ({hospital.travelTime})
                </span>
              </div>
              <Button className='mt-2'>Get Directions</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
