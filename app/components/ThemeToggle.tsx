'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // ✅ Sync with the actual DOM on mount
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="border rounded px-3 py-1 text-sm"
    >
      {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
