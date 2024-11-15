export type User = {
  name: string;
  gender: string;
  ageRange: string;
  personalities: Record<number, string>;
  appearance: string;
  targetGender: string;
  favoriteAppearance: string;
  selectedPersonalities: Record<number, string>;
  favoriteAgeRange: string;
};