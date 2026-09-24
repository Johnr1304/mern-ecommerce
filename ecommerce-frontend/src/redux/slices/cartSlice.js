import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart");

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [], // { product, name, price, image, quantity, stock }
};

const persist = (items) => localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, name, price, image, quantity = 1, stock } = action.payload;
      const existing = state.items.find((i) => i.product === product);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, stock ?? Infinity);
      } else {
        state.items.push({ product, name, price, image, quantity, stock });
      }
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.items.find((i) => i.product === product);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock ?? Infinity));
      }
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
