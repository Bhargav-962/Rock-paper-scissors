export const validateEmptyField = (value = '', errorMessage = '') => {
    return value.trim() === '' ? errorMessage : '';
}

export const validateMinLength = (value = '', minLength = 2, errorMessage = '') => {
    return value.trim().length < minLength ? errorMessage : '';
}

export const validateDuplicateEntry = (text = '', existingUsers = [], errorMessage = '') => {
    const isDuplicate = existingUsers.some(({ username }) => username.toLowerCase() === text.trim().toLowerCase());
    return isDuplicate ? errorMessage : '';
}
