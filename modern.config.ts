import moduleTools, { defineConfig } from '@modern-js/module-tools';
import storybookPlugin from '@modern-js/plugin-storybook';
import runtime from '@modern-js/runtime/cli';

export default defineConfig({
  plugins: [moduleTools(), storybookPlugin(), runtime()],
  buildPreset: 'npm-library',
});
