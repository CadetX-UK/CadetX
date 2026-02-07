const fetch = require('node-fetch');

async function debugLogin() {
    try {
        console.log('Sending login request...');
        const res = await fetch('http://localhost:3000/api/auth/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'k641259@gmail.com', password: 'CADETX' })
        });

        console.log('Status:', res.status);
        console.log('Headers:', res.headers.raw());

        const text = await res.text();
        console.log('Body start:', text.substring(0, 500)); // Print first 500 chars

        try {
            JSON.parse(text);
            console.log('Body is valid JSON');
        } catch (e) {
            console.log('Body is NOT valid JSON');
        }

    } catch (error) {
        console.error('Request failed:', error);
    }
}

debugLogin();
