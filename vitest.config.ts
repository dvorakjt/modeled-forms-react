import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      enabled: true,
      all: true,
      100: true,
      include: ['src/model/**'],
      exclude: [
        '**/*.config.ts',
        '**/*.interface.ts',
        '**/*.type.ts',
        '**/*.enum.ts',
        'src/model/validators/util/**',
      ],
    },
  },
});
