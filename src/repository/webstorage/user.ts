import { User } from './../../constants/types/user';

  export const fetchUserFromWebStorage = (): User | null => {
    const user = JSON.parse(localStorage.getItem('lovyu-user'));
    if (!user) return null
    return {
      name: user.name,
      gender: user.gender,
      ageRange: user.ageRange,
      personalities: user.personalities,
      appearance: user.appearance,
      targetGender: user.targetGender,
      favoriteAppearance: user.favoriteAppearance,
      selectedPersonalities: user.selectedPersonalities,
      favoriteAgeRange: user.favoriteAgeRange,
    };
  };

  export const saveUserToWebStorage = (profile:User) => {
    console.log('saveUserToWebStorage')
    return localStorage.setItem("lovyu-user", JSON.stringify(profile));
  };