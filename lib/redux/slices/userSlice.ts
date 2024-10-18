// userSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getPaginatedFirestoreData } from '@actions/getPaginatedFirestoreData'
import { FirebaseError } from 'firebase/app'
import { IAuthState } from '@models/IAuthState';

export interface IUsersState {
    users: IAuthState[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IUsersState = {
    users: [],
    status: 'idle',
    error: null,
};

export const getUsersData = createAsyncThunk(
    'users/getUsersData',
    async (_, thunkAPI) => {
        try {
            const users = await getPaginatedFirestoreData<IAuthState[]>('users', 10, { field: 'name', direction: 'asc' });
            return users;
        } catch (error) {
            if (error instanceof FirebaseError) {
                let message;
                switch (error.code) {
                    default:
                        message = error.message;
                        break;
                }
                return thunkAPI.rejectWithValue(message);
            }
            return thunkAPI.rejectWithValue('An unexpected error occurred');
        }
    }
);

// Update user roles thunk
// export const updateUser = createAsyncThunk('users/updateUser', async (data: { userId: string; roles: string[] }, thunkAPI) => {
//     try {
//         const updatedUser = await updateUserRoles(data.userId, data.roles);  // Update roles in API
//         return updatedUser;
//     } catch (error) {
//         return thunkAPI.rejectWithValue('Failed to update user');
//     }
// });

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsersData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUsersData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload as unknown as IAuthState[];
            })
            .addCase(getUsersData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string ?? 'Unknown error occurred';
            })
        // .addCase(updateUser.pending, (state) => {
        //     state.loading = true;
        // })
        // .addCase(updateUser.fulfilled, (state, action) => {
        //     state.loading = false;
        //     const updatedUserIndex = state.users.findIndex(u => u.id === action.payload.id);
        //     if (updatedUserIndex !== -1) {
        //         state.users[updatedUserIndex] = action.payload;
        //     }
        // })
        // .addCase(updateUser.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload as string;
        // });
    },
});

export default userSlice.reducer;