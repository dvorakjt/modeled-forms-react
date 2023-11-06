import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    exclude : [
      '**/node_modules/**', 
      '**/dist/**', 
      '**/cypress/**', 
      '**/.{idea,git,cache,output,temp}/**', 
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      'src/__test__/component/**',
      'src/__test__/hooks/**'
    ],
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
        'src/components/**',
        'src/hooks/**'
      ],
    },
  },
});
