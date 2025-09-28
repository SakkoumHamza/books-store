import globals from "globals";
import pluginJs from "@eslint/js";
import pluginN from "eslint-plugin-n";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      n: pluginN
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginN.configs["recommended"].rules,

      // disable annoying rules
      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "off",
      "n/no-process-exit": "off",

      // stylistic stuff OFF
      semi: "off",
      quotes: "off",
      "comma-dangle": "off",

      // useful rules
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  },
  {
    files: ["test/**/*.js"], // test folder
    languageOptions: {
      globals: {
        ...globals.jest // add describe, it, before, etc.
      }
    }
  }
];
