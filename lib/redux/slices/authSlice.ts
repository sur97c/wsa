// lib/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { auth } from "@lib/firebase/firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { getFirestoreData } from "@actions/getFirestoreData"
import { getUserStatus } from "@actions/authActions"
import { IAuthState } from "@models/IAuthState"
import { IProfile } from "@models/IProfile"
import { IUserClaims } from "@models/IUserClaims"

export const dynamic = 'force-dynamic'

const initialState: {
    auth: IAuthState | null;
    loading: boolean;
    error: string | null;
    showLogin: boolean;
} = {
    auth: null,
    loading: false,
    error: null,
    showLogin: false,
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

            const userStatus = await getUserStatus(user.uid)

            if (userStatus.disabled) {
                throw new Error('Esta cuenta de usuario ha sido deshabilitada.')
            }

            const userProfile = await getFirestoreData<IProfile>('users', user.uid, true)

            login({ uid: user.uid, email: email, rememberMe })

            const authState: IAuthState = {
                id: userProfile?.id || '',
                uid: user.uid,
                email: user.email || '',
                emailVerified: user.emailVerified || false,
                displayName: user.displayName || '',
                creationTime: user.metadata?.creationTime,
                lastSignInTime: user.metadata?.lastSignInTime,
                lastName: userProfile?.lastName || '',
                name: userProfile?.name || '',
                isAuthenticated: true,
                disabled: userStatus.disabled,
                customClaims: userStatus?.customClaims,
                rememberMe: credentials.rememberMe,
                lastActivity: Date.now(),
                status: userProfile?.status || 'inactive',
                createdAt: userProfile?.createdAt || '',
                updatedAt: userProfile?.updatedAt || '',
                createdBy: userProfile?.createdBy || '',
                updatedBy: userProfile?.updatedBy || '',
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
                    case 'auth/user-disabled':
                        message = 'Esta cuenta de usuario ha sido deshabilitada.';
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
    async (_, { rejectWithValue }) => {
        try {
            await delay(DELAY_TIME);
            await auth.signOut();
            return;
        } catch (error) {
            console.error(error);
            return rejectWithValue('Error al cerrar sesión');
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

export const checkUserStatus = createAsyncThunk<
    { disabled: boolean; customClaims: IUserClaims },
    string,
    { rejectValue: string }
>(
    'auth/checkUserStatus',
    async (userId: string, thunkAPI) => {
        try {
            const userStatus = await getUserStatus(userId)
            return userStatus
        } catch (error) {
            console.error(error)
            return thunkAPI.rejectWithValue('Error al verificar el estado del usuario');
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
        checkUserStatus: (state, action) => {
            state.auth = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateLastActivity: (state) => {
            if (state.auth) {
                state.auth.lastActivity = Date.now();
            }
        },
        setShowLogin: (state, action: PayloadAction<boolean>) => {
            state.showLogin = action.payload;
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
                state.error = action.error.message || 'Login failed';
            })

            // Check user status cases
            .addCase(checkUserStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkUserStatus.fulfilled, (state, action) => {
                if (state.auth) {
                    state.auth.disabled = action.payload.disabled;
                    state.auth.customClaims = action.payload.customClaims;
                }
            })
            .addCase(checkUserStatus.rejected, (state, action) => {
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

export const { login, logout, updateLastActivity, setShowLogin } = authSlice.actions;
export default authSlice.reducer;