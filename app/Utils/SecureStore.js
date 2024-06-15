import * as SecureStore from 'expo-secure-store';

export const setToken = (token) => {
    return SecureStore.setItemAsync('secure_token', token);
};

export const getToken = () => {
    return SecureStore.getItemAsync('secure_token');
};

export const setUserID = (UserID) => {
    return SecureStore.setItemAsync('UserID', UserID)
}

export const getUserID = () => {
    return SecureStore.getItemAsync('UserID')
}
