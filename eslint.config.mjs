import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // Flags established setState-in-effect idioms (mount flags, closing UI on route
      // change, syncing external libraries) used throughout this codebase pre-upgrade.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // react-three-fiber's imperative model — refs assigned to scene nodes for animation,
    // memoized Math.random() geometry generated once per mount — is fundamentally at odds
    // with the React Compiler purity assumptions these two rules check for. Both patterns
    // are correct and standard for R3F; scoped off rather than disabled site-wide.
    files: ['src/components/three/**', 'src/components/brand/**'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
