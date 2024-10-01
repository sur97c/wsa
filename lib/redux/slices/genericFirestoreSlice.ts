import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import { getDocumentsData } from '@actions/firestoreActions';
import { FirebaseError } from 'firebase/app';
import { BaseDocument } from '@lib/firebase/adapters/firestoreAdapter';

export interface FirestoreState<T extends BaseDocument> {
    documents: T[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialFirestoreState = <T extends BaseDocument>(): FirestoreState<T> => ({
    documents: [],
    status: 'idle',
    error: null,
});

export const createGenericFirestoreSlice = <T extends BaseDocument>(collectionName: string) => {
    const getFirestoreDocuments = createAsyncThunk<T[], void, { rejectValue: string }>(
        // const getFirestoreDocuments = createAsyncThunk(
        `firestore/${collectionName}/getDocuments`,
        async (_, thunkAPI) => {
            try {
                const documents = await getDocumentsData<T[]>(collectionName);
                if (documents == null) {
                    return thunkAPI.rejectWithValue('No documents found or an error occurred');
                }
                return documents;
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return thunkAPI.rejectWithValue(error.message);
                }
                return thunkAPI.rejectWithValue('An unexpected error occurred');
            }
        }
    );

    const updateFirestoreDocument = createAsyncThunk<T, { id: string; update: Partial<T> }, { rejectValue: string }>(
        `firestore/${collectionName}/updateDocument`,
        async (data: { id: string; update: Partial<T> }, thunkAPI) => {
            try {
                // Implement your update logic here
                // const updatedDoc = await updateDocumentData(collectionName, data.id, data.update);
                // if (updatedDoc == null) {
                //     return thunkAPI.rejectWithValue('Failed to update document');
                // }
                // return updatedDoc;
                throw new Error('Update functionality not implemented');
            } catch (error) {
                console.error(error);
                return thunkAPI.rejectWithValue('Failed to update document');
            }
        }
    );

    const firestoreSlice = createSlice({
        name: `firestore/${collectionName}`,
        initialState: initialFirestoreState<T>(),
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getFirestoreDocuments.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(getFirestoreDocuments.fulfilled, (state, action: PayloadAction<T[]>) => {
                    state.status = 'succeeded';
                    state.documents = action.payload as Draft<T>[];
                })
                .addCase(getFirestoreDocuments.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload ?? 'Unknown error occurred';
                })
                .addCase(updateFirestoreDocument.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(updateFirestoreDocument.fulfilled, (state, action: PayloadAction<T>) => {
                    state.status = 'succeeded';
                    const index = state.documents.findIndex(doc => doc.id === action.payload.id);
                    if (index !== -1) {
                        state.documents[index] = action.payload as Draft<T>;
                    }
                })
                .addCase(updateFirestoreDocument.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as string;
                });
        },
    });

    return {
        reducer: firestoreSlice.reducer,
        actions: firestoreSlice.actions,
        thunks: {
            getFirestoreDocuments,
            updateFirestoreDocument,
        },
    };
};

// Example usage for users
// import { IUser } from '@/types/IUser';
// export const userFirestoreSlice = createGenericFirestoreSlice<IUser>('users');
// You can now use userFirestoreSlice.reducer, userFirestoreSlice.thunks.getFirestoreDocuments, etc.