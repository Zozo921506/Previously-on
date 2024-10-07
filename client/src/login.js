import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [code, setCode] = useState(null);
    const navigate = useNavigate();
    localStorage.setItem('client_id', '1a183826b70a');
    const client_id = localStorage.getItem("client_id");

    const login = () => {
        window.location.href = `https://www.betaseries.com/authorize?client_id=${client_id}&redirect_uri=http://localhost:3000/`;
    };

    const getToken = async (authCode) => {
        if (!authCode) return;

        const url = `https://api.betaseries.com/oauth/access_token?client_id=${client_id}&client_secret=0adc895686ab73a9d6118e1869fd4c7b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&code=${authCode}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-BetaSeries-Key': '1a183826b70a'
                },
            });

            const data = await response.json();
            console.log(data);

            if (data && data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                navigate('/home');
            } else {
                console.error('Failed to fetch token');
            }
        } catch (error) {
            console.error('Failed to fetch token', error);
        }
    };

    useEffect(() => {
        const link = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            setCode(authCode);
            console.log('Authorization code found:', authCode);
            getToken(authCode);
        } else {
            console.log('Authorization code is missing');
        }
    }, []);

    return (
        <div className="login">
            <h1 className="title">Se connecter avec BetaSeries</h1>
            <button className="loginbouton" onClick={login}>
                Login
            </button>
        </div>
    );
};

export default Login;
