import pkg from "./package.json";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: true,
    },
  ],
  plugins: [typescript()],
  external: ["react", "react-dom"],
};
