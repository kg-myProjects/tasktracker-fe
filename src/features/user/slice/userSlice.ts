import type {UpdateUserPayloadDto, UserSliceState, UserDetailedDto} from "../types";
import * as api from "../services/api";
import {createAppSlice} from "../../../app/createAppSlice.ts";
import {isAxiosError} from "axios";
import type {PayloadAction} from "@reduxjs/toolkit";

const initialState: UserSliceState = {
    data: null,
    loading: false,
    error: undefined,
};

export const userSlice = createAppSlice({
    name: "user",
    initialState,
    reducers: (create) => ({
        getUserDetails: create.asyncThunk(
            async () => {
                try {
                    return await api.fetchUserDetails();
                } catch (err) {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to fetch user details");
                    }
                    throw err;
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = undefined;
                },
                fulfilled: (state, action) => {
                    state.data = action.payload;
                    state.loading = false;
                },
                rejected: (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                },
            }
        ),

        updateUserDetails: create.asyncThunk(
            async (payload: UpdateUserPayloadDto) => {
                try {
                    return await api.fetchUpdateUserDetails(payload);
                } catch (err) {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to update user details");
                    }
                    throw err;
                }
            },
            {
                pending: (state) => { state.loading = true; state.error = undefined; },
                fulfilled: (state, action) => { state.data = action.payload; state.loading = false; },
                rejected: (state, action) => { state.loading = false; state.error = action.error.message; },
            }
        ),

        updateUserAvatar: create.asyncThunk(
            async (formData: FormData) => {
                try {
                    return await api.fetchUpdateUserAvatar(formData);
                } catch (err) {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to update avatar");
                    }
                    throw err;
                }
            },
            {
                pending: (state) => { state.loading = true; state.error = undefined; },
                fulfilled: (state, action) => { state.data = action.payload; state.loading = false; },
                rejected: (state, action) => { state.loading = false; state.error = action.error.message; },
            }
        ),

        updateUserEmail: create.asyncThunk(
            async (email: string) => {
                try {
                    return await api.fetchUpdateUserEmail(email);
                } catch (err) {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to update email");
                    }
                    throw err;
                }
            },
            {
                pending: (state) => { state.loading = true; state.error = undefined; },
                fulfilled: (state, action) => { state.data = action.payload; state.loading = false; },
                rejected: (state, action) => { state.loading = false; state.error = action.error.message; },
            }
        ),
        setUserDetails: create.reducer((state, action: PayloadAction<UserDetailedDto | undefined>) => {
            state.data = action.payload ? { ...action.payload } : null;
        })
    }),
    selectors: {
        selectUserData: (state) => state.data,
        selectUserLoading: (state) => state.loading,
        selectUserError: (state) => state.error,
    },
});

export const {
    getUserDetails,
    setUserDetails,
    updateUserDetails,
    updateUserAvatar,
    updateUserEmail,
} = userSlice.actions;

export const {
    selectUserData,
    selectUserLoading,
    selectUserError,
} = userSlice.selectors;