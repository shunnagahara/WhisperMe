// src/store/slices/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../constants/types/user';

const initialState: User = {
  name: '',
  gender: '',
  ageRange: '',
  personalities: [],
  appearance: '',
  targetGender: '',
  favoriteAppearance: '',
  selectedPersonalities: [],
  favoriteAgeRange: ''
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (state, action: PayloadAction<{ key: keyof User; value: any }>) => {
      const { key, value } = action.payload;
      if (Array.isArray(state[key])) {
        (state[key] as any[]) = [...(state[key] as any[]), value];
      } else {
        (state[key] as any) = value;
      }
    },
    loadStoredProfile: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    resetProfile: () => initialState,
  },
});

export const { updateProfile, updateProfileField, loadStoredProfile, resetProfile } = profileSlice.actions;
export const selectProfile = (state: { profile: User }) => state.profile;
export default profileSlice.reducer;