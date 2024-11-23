import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUser as createUserService,
  getUsers,
  deleteUser as deleteUserService,
  updateUser as updateUserService,
} from "../services/userService";
import { User } from "../types";

interface UserState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await getUsers();
  return response;
});

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: Omit<User, "id" | "coins" | "rank">) => {
    const response = await createUserService(userData);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string) => {
    await deleteUserService(userId);
    return userId;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    await updateUserService(id, userData);
    return { id, ...userData };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      });
  },
});

export default userSlice.reducer;
