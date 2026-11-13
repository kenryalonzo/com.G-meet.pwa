import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    // These two rules assume the React Compiler, which this project does not
    // enable. They flag standard, intentional patterns (syncing state from an
    // external SDK/browser API in an effect, reading Date.now()/Math.random()
    // outside of render-critical paths) that are correct here.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
