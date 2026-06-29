import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

function App() {
  return (
    <div className='min-h-screen flex flex-col bg-(--background) text-(--text)'>
      <Header />
      <main className='flex-1 container mx-auto p-4'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
