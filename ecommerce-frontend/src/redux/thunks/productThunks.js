import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not fetch product");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/categories/list");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not fetch categories");
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  "products/fetchRecommendations",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/analytics/recommendations/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not fetch recommendations");
    }
  }
);
