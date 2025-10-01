import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  theme: 'blue' | 'dark' | 'light';
  globalMessage: string | null;
};

const initialState: UiState = {
  theme: 'blue',
  globalMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<UiState['theme']>) {
      state.theme = action.payload;
    },
    setGlobalMessage(state, action: PayloadAction<string | null>) {
      state.globalMessage = action.payload;
    },
  },
});

export const { setTheme, setGlobalMessage } = uiSlice.actions;
export default uiSlice.reducer;


