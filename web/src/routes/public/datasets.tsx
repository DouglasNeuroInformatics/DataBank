import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/public/datasets')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/public/datasets"!</div>;
}
