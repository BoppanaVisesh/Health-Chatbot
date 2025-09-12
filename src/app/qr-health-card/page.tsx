import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function QrHealthCardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Generate QR Health Card"
        description="Create a personal QR code for your health information."
      />
      <Card>
        <CardHeader>
          <CardTitle>Feature Coming Soon</CardTitle>
          <CardDescription>
            This section will allow you to upload documents and generate a QR code for your health card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check back later for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
