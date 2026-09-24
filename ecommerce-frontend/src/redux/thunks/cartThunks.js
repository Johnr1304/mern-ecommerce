// Cart is fully client-side (Redux + localStorage) until checkout, at which
// point orderThunks.placeOrder sends the finalized cart to the backend.
// This file exists so the cart mirrors the same slice/thunk architecture as
// the rest of the app for consistency and future extension (e.g. server-side
// saved carts).
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const validateCartStock = createAsyncThunk(
  "cart/validateCartStock",
  async (items, { rejectWithValue }) => {
    try {
      const checks = await Promise.all(
        items.map((item) => axiosInstance.get(`/products/${item.product}`))
      );
      return checks.map((res) => res.data.product);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not validate cart");
    }
  }
);
