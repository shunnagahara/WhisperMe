import { User } from './../../constants/types/user';

  export const fetchUserFromWebStorage = (): User => {
    const user = JSON.parse(localStorage.getItem('lovyu-user'));
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
    return localStorage.setItem("lovyu-user", JSON.stringify(profile));
  };