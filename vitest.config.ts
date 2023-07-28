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
        '**/*.interface.ts',
        '**/*.type.ts',
        'src/model/proxies/aggregated-state-changes-proxy-factory.ts',
      ],
    },
  },
});
