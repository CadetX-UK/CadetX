const fetch = require('node-fetch');

async function testApi() {
    try {
        console.log('Testing GET /api/test...');
        const res = await fetch('http://localhost:3000/api/test');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);

        console.log('Testing POST /api/test...');
        const res2 = await fetch('http://localhost:3000/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foo: 'bar' })
        });
        console.log('Status:', res2.status);
        const text2 = await res2.text();
        console.log('Body:', text2);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testApi();
