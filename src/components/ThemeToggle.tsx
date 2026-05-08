'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-full bg-muted/50 border border-border/50 hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none"
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-all animate-in zoom-in-50 duration-300" />
      ) : (
        <Moon className="w-5 h-5 transition-all animate-in zoom-in-50 duration-300" />
      )}
    </motion.button>
  );
}
