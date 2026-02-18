const API_URL = process.env.API_URL || 'http://localhost:3001/api';

export const api = {
    async get(endpoint: string) {
        const res = await fetch(`${API_URL}${endpoint}`);
        if (!res.ok) throw new Error('API request failed');
        return res.json();
    },
    async post(endpoint: string, data: any) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('API request failed');
        return res.json();
    },
    async patch(endpoint: string, data: any) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('API request failed');
        return res.json();
    },
    async delete(endpoint: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('API request failed');
        return res.json();
    },
};
