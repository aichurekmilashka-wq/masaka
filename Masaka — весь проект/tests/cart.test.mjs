import test from "node:test";
import assert from "node:assert/strict";
import { addDish, changeQuantity, orderSummary, restoreCart } from "../lib/cart.mjs";

const menu = [{ id: "salmon", amount: 420 }, { id: "tuna", amount: 680 }];
test("adding the same dish increments its quantity", () => {
  const first = addDish([], "salmon");
  assert.deepEqual(addDish(first, "salmon"), [{ id: "salmon", quantity: 2 }]);
  assert.deepEqual(first, [{ id: "salmon", quantity: 1 }]);
});
test("decreasing the last serving removes the row", () => {
  assert.deepEqual(changeQuantity([{ id: "salmon", quantity: 1 }], "salmon", -1), []);
});
test("order total uses numeric menu amounts", () => {
  assert.deepEqual(orderSummary([{ id: "salmon", quantity: 2 }, { id: "tuna", quantity: 1 }], menu), { count: 3, total: 1520 });
});
test("restoring a cart ignores unknown items and invalid quantities", () => {
  const raw = JSON.stringify([{ id: "salmon", quantity: 2 }, { id: "tuna", quantity: -1 }, { id: "x", quantity: 3 }]);
  assert.deepEqual(restoreCart(raw, menu), [{ id: "salmon", quantity: 2 }]);
  assert.deepEqual(restoreCart("broken json", menu), []);
  assert.deepEqual(restoreCart("null", menu), []);
});
test("restoring merges duplicates and caps quantities", () => {
  const raw = JSON.stringify([{ id: "salmon", quantity: 60 }, { id: "salmon", quantity: 60 }]);
  assert.deepEqual(restoreCart(raw, menu), [{ id: "salmon", quantity: 99 }]);
});
