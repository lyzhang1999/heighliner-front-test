import { DoDollar } from "dodollar";

const $$ = new DoDollar({
  batchIntercept: {
    batchInterceptHook: () => {
      // Intercept console output in Forkmain.
      if (location.hostname === "forkmain") {
        return true;
      }
      return false;
    },
    exclude: ["error"],
  },
});

export { $$ };
