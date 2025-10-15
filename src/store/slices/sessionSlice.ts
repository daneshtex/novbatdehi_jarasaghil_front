import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SessionState = {
  token: string | null;
  mobile: string | null;
};

// Load initial state from localStorage
const loadInitialState = (): SessionState => {
  try {
    const savedToken = localStorage.getItem('auth_token');
    const savedMobile = localStorage.getItem('auth_mobile');
    return {
      token: savedToken,
      mobile: savedMobile,
    };
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    return {
      token: null,
      mobile: null,
    };
  }
};

const initialState: SessionState = loadInitialState();

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string | null; mobile?: string | null }>) {
      state.token = action.payload.token;
      if (typeof action.payload.mobile !== 'undefined') {
        state.mobile = action.payload.mobile;
      }
      
      // Save to localStorage
      try {
        if (action.payload.token) {
          localStorage.setItem('auth_token', action.payload.token);
        } else {
          localStorage.removeItem('auth_token');
        }
        
        if (action.payload.mobile) {
          localStorage.setItem('auth_mobile', action.payload.mobile);
        } else if (typeof action.payload.mobile !== 'undefined') {
          localStorage.removeItem('auth_mobile');
        }
      } catch (error) {
        console.error('Failed to save session to localStorage:', error);
      }
    },
    clearSession(state) {
      state.token = null;
      state.mobile = null;
      
      // Clear localStorage
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_mobile');
      } catch (error) {
        console.error('Failed to clear session from localStorage:', error);
      }
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;


