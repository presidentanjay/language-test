import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/login', { email, password });
            const { token, user } = res.data; // Assuming backend returns { type: 'bearer', value: 'token', user? } 
            // Wait, backend AuthController returns:
            // return response.ok({ type: 'bearer', value: token.value!.release() })
            // It doesn't return user object directly in login response based on previous controller code.
            // So I need to fetch user separately or update backend. 
            // For now, I'll fetch /me after login or if I update AuthContext to do it.

            // Let's check AuthController again. 
            // It returns: { type: 'bearer', value: token }

            const tokenValue = res.data.value;
            localStorage.setItem('token', tokenValue);

            // Fetch user
            const userRes = await api.get('/me', {
                headers: { Authorization: `Bearer ${tokenValue}` }
            });

            login(tokenValue, userRes.data);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <GuestLayout>
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Sign in to CMS</h2>
                <p className="mt-2 text-sm text-gray-600">Access the admin panel</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 p-4 text-sm text-red-500 rounded-md">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
