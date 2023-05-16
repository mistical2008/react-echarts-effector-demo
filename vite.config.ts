import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { babel } from "@rollup/plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteCommonjs, esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteCommonjs(),
    babel({
      extensions: [".ts", ".tsx"],
      babelHelpers: "bundled",
      plugins: [
        [
          "effector/babel-plugin",
          {
            addLoc: true,
            reactSsr: false,
          },
        ],
      ],
    }),
    react({ fastRefresh: false }),
  ],
});
