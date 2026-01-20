import {createAppSlice} from "../../../app/createAppSlice";
import type {CreateTaskStatusDto, TaskStatusSliceState, UpdateTaskStatusDto} from "../types";
import * as api from "../services/api";
import {isAxiosError, type AxiosError} from "axios";
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

const initialState: TaskStatusSliceState = {
    taskStatuses: [],
    isLoading: false,
    createTaskStatusErrorMessage: "",
};

export const taskStatusSlice = createAppSlice({
    name: "taskStatuses",
    initialState,
    reducers: (create) => ({
        getAllTaskStatuses: create.asyncThunk(
            async (id: string) => {
                return api
                    .fetchTaskStatuses(id)
                    .catch((err: AxiosError<{ message: string }>) => {
                        // раскрываем ошибку от аксиоса и получаем сообщение
                        // бросаем новую ошибку, которая поподет в rejected case
                        throw new Error(err.response?.data?.message);
                    });
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.taskStatuses = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.taskStatuses = [];
                    console.log(action.error);
                },
            }
        ),

        createTaskStatus: create.asyncThunk(
            async (dto: CreateTaskStatusDto) => {
                return api.fetchCreateTaskStatus(dto).catch((err) => {
                    if (isAxiosError(err)) {
                        throw new Error(
                            err.response?.data?.message || "Internal Server Error"
                        );
                    }
                });
                // The value we return becomes the `fulfilled` action payload
            },
            {
                pending: (state) => {
                    // TODO add spinner here
                    state.createTaskStatusErrorMessage = "";
                },
                fulfilled: (state, action) => {
                    state.taskStatuses.push(action.payload);
                    state.createTaskStatusErrorMessage = "";
                },
                rejected: (state, action) => {
                    state.createTaskStatusErrorMessage = action.error.message;
                },
            }
        ),


        updateTaskStatus: create.asyncThunk(
            async (dto: UpdateTaskStatusDto) => {
                return api.fetchUpdateTaskStatus(dto).catch((err) => {
                    if (isAxiosError(err)) {
                        throw new Error(
                            err.response?.data?.message || "Internal Server Error"
                        );
                    }
                });
            },
            {
                fulfilled: (state, action) => {
                    const updated = action.payload;

                    const index = state.taskStatuses.findIndex(
                        (s) => s.id === updated.id
                    );

                    if (index !== -1) {
                        state.taskStatuses[index] = updated;
                    }
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    console.error(action.error);
                },
            }
        ),
    }),

    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        selectTaskStatuses: (state) => state.taskStatuses,
        selectIsLoading: (state) => state.isLoading,
        selectCreateTaskStatusErrorMessage: (state) =>
            state.createTaskStatusErrorMessage,
    },
});

export const selectSortedTaskStatuses = createSelector(
    (state: RootState) => state.taskStatuses.taskStatuses, // <- доступ к массиву внутри slice
    (taskStatuses) => [...taskStatuses].sort((a, b) => a.position - b.position)
);

export const {
    getAllTaskStatuses,
    createTaskStatus,
    updateTaskStatus,
} = taskStatusSlice.actions;

export const {
    selectTaskStatuses,
    selectIsLoading,
    selectCreateTaskStatusErrorMessage,
} = taskStatusSlice.selectors;
