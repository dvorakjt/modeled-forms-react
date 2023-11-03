import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    watch: false,
    coverage: {
      enabled: true,
      100: true,
      exclude: [
        'src/__test__/**',
        '**/*.config.ts',
        '**/*.interface.ts',
        '**/*.type.ts',
        '**/*.enum.ts',
        '**/*.error.ts',
      ],
    },
  },
});
