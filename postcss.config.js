import path from "path";

export default {
  plugins: [
    {
      postcssPlugin: "postcss-scsskit",
      Once(root) {
        const scsskitPath = "scsskit/scss/scsskit.scss";
        root.walkAtRules("scsskit", (rule) => {
          const importStatement = `@use '${scsskitPath}' as sk;`;
          rule.replaceWith(importStatement);
        });
      },
    },
  ],
};
export const postcss = true;
