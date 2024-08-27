import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../config";
import { loadState, saveState } from "../utils/localStorage";

// Async Thunks for API calls
export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async (item, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("user");

    if (!token) {
      dispatch(addToCartLocal(item));
      return rejectWithValue("User not logged in");
    }
    try {
      const response = await axiosInstance.post(`client/cart/add/item`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const increaseQuantityAPI = createAsyncThunk(
  "cart/increaseQuantityAPI",
  async (item, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("user");
    if (!token) {
      dispatch(increaseQuantityLocal(item));
      return rejectWithValue("User not logged in");
    }
    try {
      const response = await axiosInstance.post(`client/cart/inc/item`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseQuantityAPI = createAsyncThunk(
  "cart/decreaseQuantityAPI",
  async (item, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("user");
    if (!token) {
      dispatch(decreaseQuantityLocal(item));
      return rejectWithValue("User not logged in");
    }
    try {
      const response = await axiosInstance.post(`client/cart/dec/item`, item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCartAPI",
  async (item, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("user");
    if (!token) {
      dispatch(removeFromCartLocal(item));
      return rejectWithValue("User not logged in");
    }
    try {
      const response = await axiosInstance.post(
        `client/cart/remove/item`,
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearCartAPI",
  async (userId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("user");
    if (!token) {
      dispatch(clearCartLocal());
      return rejectWithValue("User not logged in");
    }
    try {
      await axiosInstance.post(
        `client/cart/remove/all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCartDetails = createAsyncThunk(
  "cart/fetchCartDetails",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("user");
    if (!token) {
      // alert("calling cart api 1 ");
      return rejectWithValue("User not logged in");
    }
    try {
      // alert("calling cart api 2");
      const response = await axiosInstance.post(
        `client/cart/get/details`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const findItemIndex = (state, payload) => {
  return state.items.findIndex((item) => {
    if (item.product._id !== payload.product._id) {
      return false;
    }

    const sizeMatch =
      payload.size.every((size) => {
        return item.size.some(
          (selectedSize) => selectedSize.sizeId === size.sizeId
        );
      }) &&
      item.size.every((size) => {
        return payload.size.some(
          (selectedSize) => selectedSize.sizeId === size.sizeId
        );
      });

    const colorMatch =
      payload.color.every((color) => {
        return item.color.some(
          (selectedColor) => selectedColor.colorId === color.colorId
        );
      }) &&
      item.color.every((color) => {
        return payload.color.some(
          (selectedColor) => selectedColor.colorId === color.colorId
        );
      });

    return sizeMatch && colorMatch;
  });
};

const initialState = loadState() || {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const existingItemIndex = findItemIndex(state, action.payload);
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload });
      }
      state.totalQuantity += 1;
      state.totalPrice +=
        action.payload.product.price * action.payload.quantity;
    },
    increaseQuantityLocal: (state, action) => {
      const itemIndex = findItemIndex(state, action.payload);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += state.items[itemIndex].product.price;
      }
    },
    decreaseQuantityLocal: (state, action) => {
      const itemIndex = findItemIndex(state, action.payload);
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
          state.totalQuantity -= 1;
          state.totalPrice -= state.items[itemIndex].product.price;
        } else {
          // Remove the item from the cart
          state.totalQuantity -= state.items[itemIndex].quantity;
          state.totalPrice -=
            state.items[itemIndex].product.price *
            state.items[itemIndex].quantity;
          state.items.splice(itemIndex, 1);
        }
      }
    },
    removeFromCartLocal: (state, action) => {
      const itemIndex = findItemIndex(state, action.payload);
      if (itemIndex !== -1) {
        const itemToRemove = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        state.totalQuantity -= itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
      }
    },
    clearCartLocal: (state) => {
      console.log(state.cart);
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartDetails.fulfilled, (state, action) => {
        const cartData = action.payload;
        state.items = cartData.items;

        state.totalQuantity = cartData.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalPrice = cartData.items.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );

        state.status = "succeeded";
      })
      .addCase(fetchCartDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        cartSlice.caseReducers.addToCartLocal(state, action);
      })
      .addCase(increaseQuantityAPI.fulfilled, (state, action) => {
        cartSlice.caseReducers.increaseQuantityLocal(state, action);
      })
      .addCase(decreaseQuantityAPI.fulfilled, (state, action) => {
        cartSlice.caseReducers.decreaseQuantityLocal(state, action);
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        cartSlice.caseReducers.removeFromCartLocal(state, action);
      })
      .addCase(clearCartAPI.fulfilled, (state, action) => {
        cartSlice.caseReducers.clearCartLocal(state, action);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const {
  addToCartLocal,
  increaseQuantityLocal,
  decreaseQuantityLocal,
  removeFromCartLocal,
  clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
