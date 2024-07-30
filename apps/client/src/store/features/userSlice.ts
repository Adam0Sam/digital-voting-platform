import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../lib/types';

export interface UserState {
  user: Partial<User>;
}

const initialState: UserState = {
  user: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
