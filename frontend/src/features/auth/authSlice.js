import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "../../api/axios"

const userFromStorage = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userFromStorage || null,
  profilePicture: userFromStorage?.profilePicture || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};


//register
export const register = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("/auth/signup", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
  state.user = null;
  state.token = null;
  state.profilePicture = null;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
},
updateUser: (state, action) => {
  const updatedFields = action.payload;

  // Merge the new values into the existing user object
  state.user = {
    ...state.user,
    ...updatedFields,
  };

  // If profilePicture is one of the updated fields, update it separately
  if (updatedFields.profilePicture) {
    state.profilePicture = updatedFields.profilePicture;
  }

  // Save updated user to localStorage
  localStorage.setItem("user", JSON.stringify(state.user));
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.profilePicture = action.payload.user.profilePicture;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
  state.profilePicture = action.payload.user.profilePicture;
  state.token = action.payload.token;
  localStorage.setItem("user", JSON.stringify(action.payload.user));
  localStorage.setItem("token", action.payload.token);
})

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { logout, updateUser } = authSlice.actions;

export default authSlice.reducer
