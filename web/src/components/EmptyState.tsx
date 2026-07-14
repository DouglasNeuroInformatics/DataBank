export const EmptyState: React.FC<{
  action?: React.ReactNode;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}> = ({ action, description, icon: Icon, title }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
      <Icon className="text-muted-foreground/60 size-10!" />
      <p className="mt-4 text-base font-medium">{title}</p>
      {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
