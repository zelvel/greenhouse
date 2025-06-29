import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { Layout } from './components/Layout';
import { Sensors } from './pages/Sensors';
import { Actuators } from './pages/Actuators';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { PlantsPage } from '@/pages/Plants';
import { AddPlantPage } from '@/pages/AddPlant';
import { EditPlantPage } from '@/pages/EditPlant';

// Initialize React Query client with more conservative settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: 3600000, // Keep unused data in cache for 1 hour
      staleTime: 30000, // Consider data fresh for 30 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/plants" element={<PlantsPage />} />
              <Route path="/plants/add" element={<AddPlantPage />} />
              <Route path="/plants/edit/:name" element={<EditPlantPage />} />
              <Route path="/" element={<PlantsPage />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/actuators" element={<Actuators />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
