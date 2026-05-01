import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LoadingScreen } from './components/LoadingScreen';
import { SavedProvider } from './context/SavedContext';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <SavedProvider>
      <div className="w-full h-screen bg-neutral-900 flex justify-center items-center overflow-hidden">
        <div className="w-[375px] h-[812px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-black shrink-0">
          {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
          <div style={{ width: '100%', height: '100%', visibility: loading ? 'hidden' : 'visible' }}>
            <RouterProvider router={router} />
          </div>
        </div>
      </div>
    </SavedProvider>
  );
}