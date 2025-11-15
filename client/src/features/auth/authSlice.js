import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8000/api/auth';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

// Async thunk: login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (formData, thunkAPI) => {
        try {
            const res = await axios.post(`${API}/login`, formData);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

// Async thunk: signup
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (formData, thunkAPI) => {
        try {
            const res = await axios.post(`${API}/signup`, formData);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            localStorage.clear();
            state.user = null;
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
