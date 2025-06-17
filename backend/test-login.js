const axios = require('axios');

const testLogin = async () => {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Flowmatic Login...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend is healthy:', healthResponse.data);
    
    // Test 2: Cookie debug
    console.log('\n2️⃣ Testing cookie debug endpoint...');
    const cookieResponse = await axios.get('http://localhost:5000/debug/cookies');
    console.log('📝 Cookie debug:', cookieResponse.data);
    
    // Test 3: Set test cookie
    console.log('\n3️⃣ Setting test cookie...');
    const setCookieResponse = await axios.get('http://localhost:5000/debug/set-cookie', {
      withCredentials: true
    });
    console.log('🍪 Set cookie response:', setCookieResponse.data);
    
    // Test 4: Login (replace with your actual credentials)
    console.log('\n4️⃣ Testing login...');
    const email = 'test@example.com'; // Replace with actual email
    const password = 'password123';   // Replace with actual password
    
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email,
      password
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('📝 Response:', loginResponse.data);
    console.log('🍪 Cookies set:', loginResponse.headers['set-cookie']);
    
    // Test 5: Get current user
    console.log('\n5️⃣ Testing authenticated request...');
    const cookies = loginResponse.headers['set-cookie'];
    const cookieHeader = cookies ? cookies.join('; ') : '';
    
    const userResponse = await axios.get(`${baseURL}/user/current`, {
      withCredentials: true,
      headers: {
        'Cookie': cookieHeader
      }
    });
    
    console.log('✅ Authenticated request successful!');
    console.log('👤 User data:', userResponse.data);
    
    console.log('\n🎉 All tests passed! Login is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure backend is running on port 5000');
    console.log('2. Check your .env file has correct values');
    console.log('3. Verify the email/password exists in database');
    console.log('4. Check if MongoDB is running');
  }
};

console.log('🚀 Starting Flowmatic Login Test...');
console.log('📝 Make sure to update email/password in this script');
console.log('⚡ Backend should be running on http://localhost:5000\n');

testLogin();
