# Xano External API Configuration for OmniSphere

## Required Endpoint Setup

To enable real market data fetching in OmniSphere, configure your Xano External_API_Request endpoint as follows:

### Endpoint Details
- **URL**: `https://x8ki-letl-twmt.n7.xano.io/api:JIterA9P/External_API_Request`
- **Method**: POST
- **Authentication**: Bearer token required

### Request Structure
```json
{
  "url": "string",      // External API URL to call
  "method": "string",   // HTTP method (GET, POST, etc.)
  "headers": "object",  // Optional headers object
  "params": "object"    // Optional parameters object
}
```

### Response Structure
```json
{
  "request": {
    "url": "string",
    "method": "string", 
    "headers": "array",
    "params": "array"
  },
  "response": {
    "headers": "array",
    "result": "any",    // The actual API response data
    "status": "number", // HTTP status code
    "error": "object"   // Error details if request failed
  }
}
```

### Required Xano Function Configuration

1. **Create Function**: External_API_Request
2. **Input Parameters**:
   - `url` (text, required)
   - `method` (text, default: "GET")
   - `headers` (json, optional)
   - `params` (json, optional)

3. **Function Logic**:
```javascript
// Add this to your Xano function
const axios = require('axios');

try {
  const config = {
    method: inputs.method || 'GET',
    url: inputs.url,
    headers: inputs.headers || {},
    params: inputs.params || {}
  };

  const response = await axios(config);
  
  return {
    request: {
      url: inputs.url,
      method: inputs.method || 'GET',
      headers: Object.entries(inputs.headers || {}),
      params: Object.entries(inputs.params || {})
    },
    response: {
      headers: Object.entries(response.headers || {}),
      result: response.data,
      status: response.status,
      error: null
    }
  };
} catch (error) {
  return {
    request: {
      url: inputs.url,
      method: inputs.method || 'GET',
      headers: Object.entries(inputs.headers || {}),
      params: Object.entries(inputs.params || {})
    },
    response: {
      headers: [],
      result: null,
      status: error.response?.status || 0,
      error: {
        code: error.code || 3,
        message: error.message || "Request failed"
      }
    }
  };
}
```

### External APIs Used by OmniSphere

1. **CoinGecko API** (Cryptocurrency prices):
   - Endpoint: `https://api.coingecko.com/api/v3/simple/price`
   - Parameters: `ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true`

2. **DeFiLlama API** (DeFi protocols):
   - Endpoint: `https://api.llama.fi/protocols`

3. **Global Market Data**:
   - Endpoint: `https://api.coingecko.com/api/v3/global`

### Testing Your Configuration

Use this curl command to test:
```bash
curl -X POST "https://x8ki-letl-twmt.n7.xano.io/api:JIterA9P/External_API_Request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    "method": "GET"
  }'
```

Expected successful response:
```json
{
  "response": {
    "result": {
      "bitcoin": {
        "usd": 43250
      }
    },
    "status": 200
  }
}
```

## Authentication Credentials

### Admin Account
- Email: `mmanthe37@live.seminolestate.edu`
- Password: `Yinyin@0430uni37#xan`
- User ID: 117643

### Test Account (Public Users)
- Email: `testuser@omnisphere.com`
- Password: `password123`
- User ID: 999999

### API Token
- Bearer Token: `a538f02f-8cd3-4716-8897-cda1d72304b7`

## Implementation Status

✅ Authentication system with test account
✅ Public browsing without forced login
✅ Portfolio service with authentic empty states
✅ Registration and password recovery
✅ External API service integration
⚠️ Xano External_API_Request endpoint needs configuration

Once the External_API_Request endpoint is properly configured in your Xano instance, OmniSphere will automatically fetch real market data instead of using empty states.