import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateUserForm } from './components/CreateUserForm';
import { UserList } from './components/UserList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Fastify + React Query Recipe</h1>
        <p>Type-safe full-stack application with ts-contract</p>
        
        <CreateUserForm />
        <UserList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
