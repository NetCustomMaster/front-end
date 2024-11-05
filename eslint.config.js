import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default js.config(
  {
    ignores: ['dist'], // dist 폴더 무시
  },
  {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    plugins: {
      'react-hooks': reactHooks.configs.recommended, // React Hooks ESLint 규칙
      'react-refresh': reactRefresh, // React Refresh ESLint 플러그인
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Hooks 사용 규칙 (필수)
      'react-hooks/exhaustive-deps': 'warn', // 의존성 배열 경고
      'react-refresh/only-export-components': 'warn', // React 컴포넌트 내에서만 export 경고
    },
    languageOptions: {
      globals: {
        ...globals.browser, // 브라우저 환경 전역 변수 사용
        ...globals.node, // Node.js 전역 변수 사용
      },
    },
  }
);
