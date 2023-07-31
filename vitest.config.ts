import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
      ],
    },
  },
});
