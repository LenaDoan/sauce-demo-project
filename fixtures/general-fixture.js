import { test as test1 } from "./login-fixture.js";

import { mergeTests, expect } from "@playwright/test";

export const test = mergeTests(test1);
export { expect };