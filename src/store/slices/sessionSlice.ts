import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SessionState = {
  token: string | null;
  mobile: string | null;
};

const initialState: SessionState = {
  token: null,
  mobile: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string | null; mobile?: string | null }>) {
      state.token = action.payload.token;
      if (typeof action.payload.mobile !== 'undefined') {
        state.mobile = action.payload.mobile;
      }
    },
    clearSession(state) {
      state.token = null;
      state.mobile = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;


