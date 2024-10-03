// lib/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { auth } from "@lib/firebase/firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { getFirestoreData } from "@actions/getFirestoreData"
import { IAuthState } from "@models/IAuthState"
import { IProfile } from "@models/IProfile"

export const dynamic = 'force-dynamic'

const initialState: {
    auth: IAuthState | null;
    loading: boolean;
    error: string | null;
} = {
    auth: null,
    loading: false,
    error: null,
}

const DELAY_TIME: number = 0
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string; rememberMe: boolean }, thunkAPI) => {
        const { email, password, rememberMe } = credentials
        try {
            await delay(DELAY_TIME)

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const userProfile = await getFirestoreData<IProfile>('users', user.uid, true)

            // localStorage.setItem('rememberMe', rememberMe.toString())
            login({ uid: user.uid, email: email, rememberMe })

            const authState: IAuthState = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                disabled: userProfile?.disabled || true,
                firebaseId: userProfile?.firebaseId || '',
                lastName: userProfile?.lastName || '',
                name: userProfile?.name || '',
                roles: userProfile?.roles || [],
                isAuthenticated: true,
                rememberMe,
                lastActivity: Date.now(),
                customClaims: userProfile?.customClaims
            }

            console.log('User profile fetched:', userProfile) // Log para debug
            return authState
        } catch (error) {
            if (error instanceof FirebaseError) {
                let message;
                switch (error.code) {
                    case 'auth/too-many-requests':
                        message = 'El acceso a esta cuenta se ha deshabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión.';
                        break;
                    case 'auth/invalid-credential':
                        message = 'Credenciales invalidas.';
                        break;
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

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, thunkAPI) => {
        try {
            await delay(DELAY_TIME);
            await signOut(auth);
            return;
        } catch (error) {
            console.error(error);
            return thunkAPI.rejectWithValue('Error al cerrar sesión');
        }
    }
);

export const recoverAccess = createAsyncThunk(
    'auth/recoverAccess',
    async (email: string, thunkAPI) => {
        try {
            await delay(DELAY_TIME);
            await sendPasswordResetEmail(auth, email);
            return 'Email de recuperación enviado';
        } catch (error) {
            if (error instanceof FirebaseError) {
                let message;
                switch (error.code) {
                    case 'auth/too-many-requests':
                        message = 'El envio se deshabilito temporalmente debido a muchos intentos.';
                        break;
                    case 'auth/user-not-found':
                        message = 'No se encontró una cuenta con ese email.';
                        break;
                    default:
                        message = error.message;
                        break;
                }
                return thunkAPI.rejectWithValue(message);
            }
            return thunkAPI.rejectWithValue('Error inesperado en la recuperación de la cuenta');
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.auth = action.payload;
            state.loading = false;
            state.error = null;
        },
        logout: (state) => {
            state.auth = null;
            state.loading = false;
            state.error = null;
        },
        updateLastActivity: (state) => {
            if (state.auth) {
                state.auth.lastActivity = Date.now();
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.auth = action.payload;
                state.loading = false;
                state.error = null;
                console.log('State after login:', state); // Log para debug
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.auth = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // Recover access cases
            .addCase(recoverAccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recoverAccess.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(recoverAccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
    },
});

export const { login, logout, updateLastActivity } = authSlice.actions;
export default authSlice.reducer;