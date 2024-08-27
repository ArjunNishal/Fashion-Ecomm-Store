import { load } from "@cashfreepayments/cashfree-js";
// export const cashfree = await load({
//   mode: "production", //or sandbox
// });

export const cashfree = await load({
  mode: "sandbox", 
});
