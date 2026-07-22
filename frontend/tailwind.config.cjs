module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: 'var(--shadow)',
      },
      colors: {
        primary: 'var(--accent)',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        muted: 'var(--muted)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}
