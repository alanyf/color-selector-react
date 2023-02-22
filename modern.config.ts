import moduleTools, { defineConfig } from '@modern-js/module-tools';
import storybookPlugin from '@modern-js/plugin-storybook';

export default defineConfig({
  plugins: [moduleTools(),  storybookPlugin()],
  buildPreset: 'npm-library',
});
