export const calcCartTotals = (items) => {
  let totalQuantity = 0;
  let subtotal = 0;
  items.forEach((item) => {
    totalQuantity += item.quantity;
    subtotal += item.price * item.quantity;
  });
  return { totalQuantity, subtotal };
};

export const productToCartItem = (product, quantity = 1) => {
  const salePrice = product.discount_price || product.price;
  return {
    id: product._id,
    name: product.name,
    description: product.short_description || product.brand || '',
    price: salePrice,
    originalPrice: product.price,
    image: product.main_image,
    sku: product.sku || '',
    maxStock: product.stock_quantity ?? 99,
    quantity: Math.min(quantity, product.stock_quantity ?? 99),
  };
};

export const formatPrice = (amount) =>
  `Rs.${Number(amount).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

export const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('glowfy_cart');
    if (saved) {
      const { items } = JSON.parse(saved);
      if (Array.isArray(items)) {
        return { items, ...calcCartTotals(items) };
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { items: [], totalQuantity: 0, subtotal: 0 };
};

export const saveCartToStorage = (items) => {
  localStorage.setItem('glowfy_cart', JSON.stringify({ items }));
};
