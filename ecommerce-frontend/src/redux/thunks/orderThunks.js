import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/orders", orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/orders/my-orders");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not fetch orders");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/orders/${orderId}/cancel`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not cancel order");
    }
  }
);
