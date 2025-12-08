let apiKey = null;

async function getApiKey() {
    const response = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
        method: 'POST'
    });

    const data = await response.json();
    console.log('API-nyckel hämtad:', data);

    apiKey = data.key; 
    return apiKey;
}
async function createTenant() {

    await getApiKey();

    const url = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants';

    const bodyToSend = {
        name: 'HenrikL'
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-zocom': apiKey 
        },
        body: JSON.stringify(bodyToSend)
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Tenant skapad:', data);
}

createTenant();
