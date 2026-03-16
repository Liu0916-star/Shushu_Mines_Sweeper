import Game from './pages/Game';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/sonner.jsx"
import { Analytics } from '@vercel/analytics/react'; 

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;