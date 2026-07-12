async function runTest() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginInput: 'John Doe',
        password: 'password123'
      })
    });
    
    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(`Login failed: ${errText}`);
    }
    
    const data = await loginRes.json();
    const user = data.user;
    console.log('Logged in as:', user.username, 'Role:', user.role);

    console.log('Proposing CSR activity...');
    const activityPayload = {
      id: `csr-test-${Date.now()}`,
      title: 'Rooftop Solar Workshop Test',
      description: 'Cleaning and auditing rooftop solar panels',
      date: '2026-07-20',
      maxParticipants: 15,
      pointsValue: 150,
      xpValue: 150,
      participants: [user.username], // Array
      status: 'Pending',
      evidenceFileAttached: false,
      evidenceFileName: '',
      departmentId: 'dept-3'
    };

    const proposeRes = await fetch('http://127.0.0.1:5001/api/csr/propose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': user.username,
        'x-role': user.role
      },
      body: JSON.stringify(activityPayload)
    });

    console.log('Propose Status:', proposeRes.status);
    const proposeData = await proposeRes.json();
    console.log('Propose Response:', proposeData);

  } catch (error) {
    console.error('Test error:', error);
  }
}

runTest();
