/** @typedef {{ id: string, quantity: number }} CartRow */
/** @typedef {{ id: string, amount: number }} MenuEntry */

/** @param {CartRow[]} cart @param {string} id @returns {CartRow[]} */
export function addDish(cart, id) {
  return cart.some((row) => row.id === id)
    ? changeQuantity(cart, id, 1)
    : [...cart, { id, quantity: 1 }];
}

/** @param {CartRow[]} cart @param {string} id @param {number} delta @returns {CartRow[]} */
export function changeQuantity(cart, id, delta) {
  return cart.map((row) => row.id === id
    ? { ...row, quantity: Math.min(99, row.quantity + delta) } : row)
    .filter((row) => row.quantity > 0);
}

/** @param {CartRow[]} cart @param {MenuEntry[]} menu */
export function orderSummary(cart, menu) {
  return cart.reduce((sum, row) => {
    const item = menu.find((dish) => dish.id === row.id);
    return item ? { count: sum.count + row.quantity, total: sum.total + item.amount * row.quantity } : sum;
  }, { count: 0, total: 0 });
}

/** @param {string | null} raw @param {MenuEntry[]} menu @returns {CartRow[]} */
export function restoreCart(raw, menu) {
  try {
    const value = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    /** @type {CartRow[]} */
    const out = [];
    for (const row of value) {
      if (!row || typeof row.id !== "string" || !menu.some((item) => item.id === row.id)
        || !Number.isInteger(row.quantity) || row.quantity < 1) continue;
      const existing = out.find((item) => item.id === row.id);
      if (existing) existing.quantity = Math.min(99, existing.quantity + row.quantity);
      else out.push({ id: row.id, quantity: Math.min(99, row.quantity) });
    }
    return out;
  } catch { return []; }
}
