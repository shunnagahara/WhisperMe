// src/utils/calculateProgress.ts
import { User } from "../../constants/types/user";

export const calculateProgress = (profile: User): number => {
  const totalItems = Object.keys(profile).length;

  let completedItems = 0;

  if (profile.name) completedItems++;
  if (profile.gender) completedItems++;
  if (profile.ageRange) completedItems++;
  if (Object.keys(profile.personalities).length > 0) completedItems++;
  if (profile.appearance) completedItems++;
  if (profile.targetGender) completedItems++;
  if (profile.favoriteAppearance) completedItems++;
  if (Object.keys(profile.selectedPersonalities).length > 0) completedItems++;
  if (profile.favoriteAgeRange) completedItems++;

  return Math.floor((completedItems / totalItems) * 100);
};
