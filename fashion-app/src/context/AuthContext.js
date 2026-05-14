import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

    const login = (data) => {
        setUser(data.user); // chỉ lưu phần user
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token); // lưu riêng token nếu cần
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
