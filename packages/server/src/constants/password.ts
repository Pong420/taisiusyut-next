export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_MESSAGE = `password cannot less then ${PASSWORD_MIN_LENGTH}`;

export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_MAX_LENGTH_MESSAGE = `password cannot more then ${PASSWORD_MAX_LENGTH}`;

export const PASSWORD_REGEX = /(?=.*?[a-z,A-Z])(?=.*?[0-9])/;
export const PASSWORD_REGEX_MESSAGE = 'password must contain at least one letter and one number';

export const PASSWORD_EUQAL_TO_USERNAME = 'password should not same as username';
