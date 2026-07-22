import React from 'react';
import { FolderGit2  , Globe2 } from 'lucide-react';
import { useToast } from '@/features/notifications/ToastProvider';

/**
 * A lightweight social sign-in block for the auth forms.
 *
 * In this starter app the buttons are intentionally present as UI polish and to show the intended
 * experience. They trigger a toast because the backend does not yet expose real OAuth providers.
 */
export const SocialAuthButtons: React.FC = () => {
  const { addToast } = useToast();

  const handleSocialClick = (provider: string) => {
    addToast(`${provider} sign-in`, 'Social authentication is coming soon. Use email and password for now.', 'info');
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-(--border)" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">or continue with</p>
        <div className="h-px flex-1 bg-(--border)" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSocialClick('Google')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-semibold text-(--text) transition hover:border-(--accent)"
        >
          <Globe2 size={16} />
          Google
        </button>

        <button
          type="button"
          onClick={() => handleSocialClick('FolderGit2  ')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-semibold text-(--text) transition hover:border-(--accent)"
        >
          <FolderGit2   size={16} />
          FolderGit2  
        </button>
      </div>
    </div>
  );
};
