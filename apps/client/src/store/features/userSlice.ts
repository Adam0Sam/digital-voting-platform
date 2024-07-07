import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces';

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

export default userSlice.reducer;
