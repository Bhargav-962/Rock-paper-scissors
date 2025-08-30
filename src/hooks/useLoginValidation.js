import { useState } from "react";
import { validateEmptyField, validateMinLength, validateDuplicateEntry, validateNoSpaces } from "../utils/validations";

const useLoginValidation = (value, existingPlayers = []) => {
    const [displayErrors, setDisplayErrors] = useState({});

    const { username = "" } = value;

    const formFocused = (field) => {
        if (!field) {
            setDisplayErrors(prev => ({
                ...prev,
                username: true
            }));
            return;
        }
        setDisplayErrors((prev) => ({ ...prev, [field]: true }));
    };

    // Validation functions for username field
    const usernameValidation = () => {
        return [
            validateEmptyField(username, "Username is required"),
            validateMinLength(username, 2, "Username must be at least 2 characters"),
            validateNoSpaces(username, "Username cannot contain spaces"),
            validateDuplicateEntry(username, existingPlayers, "Username already taken")
        ].filter(Boolean);
    };

    // Function to get all validation errors
    const getValidationErrors = () => {
        return {
            username: usernameValidation()
        };
    };

    const validationErrors = getValidationErrors();
    const isFormValid = Object.values(validationErrors).every(arr => arr.length === 0);

    return {
        displayErrors,
        formFocused,
        validationErrors,
        isFormValid
    };
};

export default useLoginValidation;
