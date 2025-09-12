import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Car, MapPin } from 'lucide-react';

const hospitals = [
  {
    name: 'City General Hospital',
    address: '123 Health St, Metropolis, USA',
    distance: '2.5 miles',
    travelTime: '10 min drive',
  },
  {
    name: 'St. Jude Medical Center',
    address: '456 Wellness Ave, Metropolis, USA',
    distance: '3.1 miles',
    travelTime: '12 min drive',
  },
  {
    name: 'Oak Valley Community Hospital',
    address: '789 Cure Blvd, Suburbia, USA',
    distance: '5.8 miles',
    travelTime: '20 min drive',
  },
  {
    name: 'Northside Regional Clinic',
    address: '101 Healing Rd, Suburbia, USA',
    distance: '6.2 miles',
    travelTime: '22 min drive',
  },
];


export default function HospitalsPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'hospital-map');

  return (
    <div className="space-y-8 w-full p-4 sm:p-6 lg:p-8 force-full-width">
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
                <p className="text-xl sm:text-2xl font-bold text-white text-center px-4">(Map integration requires API key)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {hospitals.map((hospital) => (
          <Card key={hospital.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{hospital.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">{hospital.address}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Car className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {hospital.distance} away ({hospital.travelTime})
                </span>
              </div>
              <Button className='mt-4 w-full sm:w-auto'>Get Directions</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
