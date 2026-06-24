// Tailwind CDN runtime config — shared theme tokens
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        deloitte: {
          green: '#86BC25',
          'green-dark': '#6FA01D',
          dark: '#0F0F0F',
        },
        ink: '#1A1A1A',
        muted: '#6B7280',
        bg: '#F7F7F5',
        border: '#E5E5E5',
      },
      fontFamily: {
        sans: ['Open Sans Hebrew', 'system-ui', 'sans-serif'],
        latin: ['Open Sans Hebrew', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        survey: '720px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)',
      },
    },
  },
};
