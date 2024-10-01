import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { auth } from "@lib/firebase/firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { getDocumentData } from "@actions/firestoreActions"
import { IAuthState } from "@models/IAuthState"
import { IProfile } from "@models/IProfile"

export const dynamic = 'force-dynamic';

const initialState: IAuthState = {
    isAuthenticated: false,
    user: null,
    rememberMe: false,
    lastActivity: null,
    loading: false,
    error: null,
};

const DELAY_TIME: number = 0;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string; rememberMe: boolean }, thunkAPI) => {
        const { email, password, rememberMe } = credentials;
        try {
            await delay(DELAY_TIME);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userProfile = await getDocumentData<IProfile>('users', user.uid);
            const token = await user.getIdTokenResult();
            localStorage.setItem('rememberMe', rememberMe.toString());
            login({ uid: user.uid, email: email, rememberMe });
            return {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                customClaims: token.claims,
                profile: userProfile,
                rememberMe: rememberMe
            };
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
            state.isAuthenticated = true;
            state.user = action.payload.user;
            if (state.user) {
                state.user.customClaims = action.payload.customClaims;
                state.user.profile = action.payload.profile;
            }
            state.rememberMe = action.payload.rememberMe;
            state.lastActivity = Date.now();
            state.loading = false;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.rememberMe = false;
            state.lastActivity = Date.now();
            state.loading = false;
        },
        updateLastActivity: (state) => {
            state.lastActivity = Date.now();
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                if (state.user) {
                    state.user.uid = action.payload.uid;
                    state.user.email = action.payload.email;
                    state.user.displayName = action.payload.displayName;
                    state.user.customClaims = action.payload.customClaims;
                    state.user.profile = action.payload.profile;
                }
                state.rememberMe = action.payload.rememberMe;
                state.lastActivity = Date.now();
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.rememberMe = false;
                state.lastActivity = Date.now();
                state.loading = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
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
                state.error = action.payload as string;
            });
    },
});

export const { login, logout, updateLastActivity } = authSlice.actions; // ToBe used by AuthStateListener component
export default authSlice.reducer;