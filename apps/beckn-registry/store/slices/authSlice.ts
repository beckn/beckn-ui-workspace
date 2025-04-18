import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@services/authService'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  identifier: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await authService.login({ identifier: credentials.identifier, password: credentials.password })
    return response
  } catch (error) {
    const err = error as Error
    return rejectWithValue(err.message || 'Login failed')
  }
})

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials.email, credentials.password)
      return response
    } catch (error) {
      const err = error as Error
      return rejectWithValue(err.message || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getCurrentUser()
    return response
  } catch (error) {
    const err = error as Error
    return rejectWithValue(err.message || 'Failed to get user')
  }
})

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token: string) => {
  const response = await authService.verifyEmail(token)
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, state => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.fulfilled, state => {
        state.user = null
        state.isAuthenticated = false
      })
      // Get Current User
      .addCase(getCurrentUser.pending, state => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(getCurrentUser.rejected, state => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
      // Verify Email
      .addCase(verifyEmail.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, state => {
        state.loading = false
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Email verification failed'
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
