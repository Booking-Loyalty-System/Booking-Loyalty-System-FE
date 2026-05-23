import React, { useState } from 'react';
import { useAuth } from '../../application/useAuth.ts';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, error } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Kích hoạt hook login với requestBody đúng chuẩn
        login({ email, password });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Đăng Nhập</h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Dang xử lý...' : 'Đăng nhập'}
                </button>

                {error && <p style={{ color: 'red' }}>Đăng nhập thất bại. Vui lòng thử lại!</p>}
            </form>
        </div>
    );
};