import {createAppSlice} from "../../../app/createAppSlice";
import type {CreateTaskStatusDto, TaskStatus, TaskStatusSliceState, UpdateTaskStatusDto} from "../types";
import * as api from "../services/api";
import {isAxiosError, type AxiosError} from "axios";
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { mapTaskStatusFromApi } from "../mapper/mapper.ts";

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
                        throw new Error(err.response?.data?.message || "Failed to fetch task statuses.");
                    });
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.taskStatuses = action.payload.map(mapTaskStatusFromApi);
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.taskStatuses = [];
                    console.log(action.error.message);
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
                    throw err;
                });
            },
            {
                pending: (state) => {
                    state.createTaskStatusErrorMessage = "";
                },
                fulfilled: (state, action) => {
                    state.taskStatuses.push(mapTaskStatusFromApi(action.payload));
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
                    throw err;
                });
            },
            {
                fulfilled: (state, action) => {
                    const updated = mapTaskStatusFromApi(action.payload);

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

        deleteTaskStatus: create.asyncThunk(
            async (id: string) => {
                return api.fetchDeleteTaskStatus(id).catch((err) => {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to delete task status.");
                    }
                    throw err;
                }).then(() => id);
            },
            {
                fulfilled: (state, action) => {
                    state.taskStatuses = state.taskStatuses.filter(s => s.id !== action.payload);
                },
                rejected: (_state, action) => {
                    console.error(action.error);
                }
            }
        ),

        updateTaskStatusesOrder: create.asyncThunk(
            async (newOrder: TaskStatus[]) => {
                return api.fetchUpdateTaskStatusesOrder(newOrder).catch((err) => {
                    if (isAxiosError(err)) {
                        throw new Error(err.response?.data?.message || "Failed to update task statuses order.");
                    }
                    throw err;
                });
            },
            {
                fulfilled: (state, action) => {
                    state.taskStatuses = action.payload.map(mapTaskStatusFromApi);
                },
                rejected: (_state, action) => {
                    console.error(action.error.message);
                }
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
    deleteTaskStatus,
    updateTaskStatusesOrder
} = taskStatusSlice.actions;

export const {
    selectTaskStatuses,
    selectIsLoading,
    selectCreateTaskStatusErrorMessage,
} = taskStatusSlice.selectors;
