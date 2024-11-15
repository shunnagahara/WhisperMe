import { User } from "../../constants/types/user"; // User型を適切なパスからインポート
import { fetchUserFromWebStorage, saveUserToWebStorage } from "../../repository/webstorage/user";
import { errorMessages } from "../../constants/common";
import { NavigateFunction } from 'react-router-dom';

  export const validateInputs = (profile: User) => {
    const newErrors: { [key: string]: string } = {};

    if (!profile.name.trim()) newErrors.name                                        = errorMessages.name.required;
    if (!profile.gender) newErrors.gender                                           = errorMessages.gender.required;
    if (!profile.ageRange) newErrors.ageRange                                       = errorMessages.ageRange.required;
    if (Object.keys(profile.personalities).length                                   === 0) newErrors.personalities = errorMessages.personalities.required;
    if (profile.gender && !profile.appearance) newErrors.appearance                 = errorMessages.appearance.required;
    if (!profile.targetGender) newErrors.targetGender                               = errorMessages.targetGender.required;
    if (!profile.favoriteAgeRange) newErrors.favoriteAgeRange                       = errorMessages.favoriteAgeRange.required;
    if (Object.keys(profile.selectedPersonalities).length                           === 0) newErrors.selectedPersonalities = errorMessages.selectedPersonalities.required;
    if (profile.gender && !profile.favoriteAppearance) newErrors.favoriteAppearance = errorMessages.favoriteAppearance.required;

    return newErrors;
  };

  export const isUserDataComplete = () => {
    const storedUserData = fetchUserFromWebStorage();
    if (storedUserData) {
      return storedUserData.name && storedUserData.gender && storedUserData.ageRange && storedUserData.personalities && storedUserData.appearance && storedUserData.targetGender && storedUserData.favoriteAppearance && storedUserData.selectedPersonalities && storedUserData.favoriteAgeRange;
    }
    return false;
  };

  export const handleNext = (
    profile: User,
    setErrors: (errors: { [key: string]: string }) => void,
    navigate: (path: string) => void
  ) => {
    const validationErrors = validateInputs(profile);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      saveUserToWebStorage(profile)
      navigate("/list");
    }
  };

  export const handleModalClose = (
    setShowModal: (show: boolean) => void,
    navigate: NavigateFunction,
    navigateToChat: boolean
  ) => {
    setShowModal(false);
    if (navigateToChat) {
      navigate('/list'); // Navigate to chat room list if user agrees
    }
  };