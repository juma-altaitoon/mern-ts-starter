import { Outlet } from 'react-router-dom';
import Header from "@/components/Header";
import { PageShell } from "@/components/ui/PageShell";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-background">
        <PageShell>
          <Outlet />
        </PageShell>
      </main>
    </div>
  );
}

export default App;
