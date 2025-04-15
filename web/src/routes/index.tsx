import { createFileRoute } from '@tanstack/react-router';

const Index = () => {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
};

const Route = createFileRoute('/')({
  component: Index
});

export { Route };
