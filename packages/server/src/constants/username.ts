export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MIN_LENGTH_MESSAGE = `username cannot less then ${USERNAME_MIN_LENGTH}`;

export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_MAX_LENGTH_MESSAGE = `username cannot more then ${USERNAME_MAX_LENGTH}`;

export const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
export const USERNAME_REGEX_MESSAGE = 'username can only contain alphanumeric characters (letters A-Z, numbers 0-9)';

export const USERNAME_BLACKLIST = ['admin'];
export const USERNAME_BLACKLIST_REGEX = new RegExp(`^(?!.*(${USERNAME_BLACKLIST.join('|')}))`, 'gi');
export const USERNAME_BLACKLIST_REGEX_MESSAGE = 'username contain blacklisted word';
