/** @type {import('jest').Config} */
const config = {
  // Использование ts-jest для обработки TypeScript файлов
  preset: "ts-jest",

  // Тестовая среда для React компонентов
  testEnvironment: "jsdom",

  // Корневая директория для тестов
  rootDir: ".",

  // Паттерны для поиска тестовых файлов
  testMatch: [
    "<rootDir>/app/**/*.test.{ts,tsx,js,jsx}",
    "<rootDir>/app/**/*.spec.{ts,tsx,js,jsx}",
  ],

  // Маппинг модулей для поддержки алиасов путей из tsconfig
  moduleNameMapper: {
    "^home/(.*)$": "<rootDir>/app/home/$1",
    // Мокирование CSS и SCSS файлов
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Расширения файлов для обработки
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Трансформация файлов
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // Игнорирование трансформации для node_modules
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],

  // Настройки покрытия кода
  collectCoverage: false, // по умолчанию выключено, можно включить через CLI
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/index.tsx",
    "!app/bootstrap.tsx",
    "!app/**/*.stories.{ts,tsx}",
    "!app/**/*.test.{ts,tsx}",
    "!app/**/*.spec.{ts,tsx}",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "cobertura"],

  // Пороги покрытия кода
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Очистка моков между тестами
  clearMocks: true,

  // Восстановление моков между тестами
  restoreMocks: true,

  // Подробный вывод результатов тестов
  verbose: false,

  // Завершение при ошибке
  bail: true,
};

module.exports = config;
