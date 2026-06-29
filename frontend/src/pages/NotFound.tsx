import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-(--background) text-(--text) p-6">
      <div className="max-w-xl text-center rounded-3xl border border-(--border) bg-(--surface) p-10 shadow-(--shadow)">
        <p className="text-6xl font-black tracking-tight text-(--accent)">404</p>
        <h1 className="mt-6 text-3xl font-semibold text-(--text)">Uh-oh, the page flew away!</h1>
        <p className="mt-4 text-(--muted) leading-relaxed">
          The route you tried to visit does not exist in this galaxy. Don't worry — we've already sent a search party.
        </p>
        <div className="mt-8 inline-flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-full bg-(--accent) px-6 py-3 font-semibold text-(--surface) transition hover:bg-(--accent-hover)"
          >
            Return home
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-(--border) px-6 py-3 text-(--text) transition hover:border-(--accent)"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
