module.exports = {
  extends: [
    "mantine",
    "plugin:@next/next/recommended",
    "plugin:jest/recommended",
    "plugin:storybook/recommended",
    "next/core-web-vitals",
  ],
  plugins: ["testing-library", "jest"],
  overrides: [
    {
      files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: {
          resolve: {
            alias: {
              "~": path.join(__dirname, "src/app"),
            },
            extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
          },
        },
      },
    },
  },
};
