let apiKey = null; // Global variabel för att spara nyckeln
let tenantId = null; // Global variabel för att spara tenantId

async function getApiKey() {
    const response = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys', {
    method: 'POST'
});

    apiKey = await response.json();
    console.log('API-nyckel hämtad:', apiKey);
    return apiKey;
}
getApiKey()


const url = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants';
const bodyToSend = {
    name: 'Henrik'
}
const options = {
    method: 'POST',
    body: JSON.stringify(bodyToSend),
    headers: {
        'Content-Type': 'application/json',   
    },
    
}