interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1.5 fade-slide-up">
      <h1 className="font-headline text-3xl font-bold tracking-tight gradient-text">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-lg fade-slide-up" style={{ animationDelay: '0.1s' }}>
          {description}
        </p>
      )}
    </div>
  );
}
