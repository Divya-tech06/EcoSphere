const BASE_URL = 'http://127.0.0.1:5001/api';

// Fetch Headers builder
const getHeaders = (username, role) => {
  return {
    'Content-Type': 'application/json',
    'x-username': username || '',
    'x-user-role': role || ''
  };
};

export const api = {
  // Authentication Register
  async register(username, email, password, role) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Authentication Login
  async login(loginInput, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginInput, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  // Fetch overall database
  async fetchData(username, role) {
    const res = await fetch(`${BASE_URL}/data`, {
      method: 'GET',
      headers: getHeaders(username, role)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fetch data failed');
    return data;
  },

  // Switch role session
  async switchProfile(username, role) {
    const res = await fetch(`${BASE_URL}/profile/switch`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to switch role');
    return data;
  },

  // Log Carbon Emissions
  async logEmission(username, role, tx) {
    const res = await fetch(`${BASE_URL}/emissions`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify(tx)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to log emission');
    return data;
  },

  // Approve Emission Transaction (Manager review of Employee offset)
  async approveEmission(username, role, txId) {
    const res = await fetch(`${BASE_URL}/emissions/approve`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ txId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to approve offset');
    return data;
  },

  // Reject Emission Transaction (Manager review of Employee offset)
  async rejectEmission(username, role, txId) {
    const res = await fetch(`${BASE_URL}/emissions/reject`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ txId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reject offset');
    return data;
  },

  // Admin: Get all users list
  async fetchUsers(username, role) {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: getHeaders(username, role)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data;
  },

  // Admin: Update user authority role
  async updateUserRole(username, role, targetUser, targetRole) {
    const res = await fetch(`${BASE_URL}/users/update-role`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ targetUser, targetRole })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user role');
    return data;
  },

  // Admin: Remove a user account
  async deleteUser(username, role, targetUser) {
    const res = await fetch(`${BASE_URL}/users/delete`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ targetUser })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },

  // Admin: Register a new organizational department
  async createDepartment(username, role, deptData) {
    const res = await fetch(`${BASE_URL}/departments/create`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify(deptData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create department');
    return data;
  },

  // Profile: Change email/password settings
  async updateProfile(username, role, email, password) {
    const res = await fetch(`${BASE_URL}/profile/update`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile settings');
    return data;
  },

  // Propose CSR activity
  async proposeCsr(username, role, activity) {
    const res = await fetch(`${BASE_URL}/csr/propose`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify(activity)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to propose activity');
    return data;
  },

  // Join CSR activity
  async joinCsr(username, role, activityId, participant) {
    const res = await fetch(`${BASE_URL}/csr/join`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ activityId, participant })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to join activity');
    return data;
  },

  // Approve CSR activity (Requires Manager role)
  async approveCsr(username, role, activityId) {
    const res = await fetch(`${BASE_URL}/csr/approve`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ activityId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Action blocked');
    return data;
  },

  // Upload proof/evidence for CSR activity
  async uploadCsrEvidence(username, role, activityId, fileName) {
    const res = await fetch(`${BASE_URL}/csr/evidence`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ activityId, fileName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload CSR evidence');
    return data;
  },

  // Report compliance issue
  async reportCompliance(username, role, issue) {
    const res = await fetch(`${BASE_URL}/compliance`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify(issue)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to report issue');
    return data;
  },

  // Resolve compliance issue (Requires Manager role)
  async resolveCompliance(username, role, issueId) {
    const res = await fetch(`${BASE_URL}/compliance/resolve`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ issueId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Action blocked');
    return data;
  },

  // Sign governance policy
  async signPolicy(username, role, policyId, employee) {
    const res = await fetch(`${BASE_URL}/policy/sign`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ policyId, employee })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sign policy');
    return data;
  },

  // Redeem marketplace reward
  async redeemReward(username, role, rewardId) {
    const res = await fetch(`${BASE_URL}/rewards/redeem`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify({ rewardId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to redeem reward');
    return data;
  },

  // Apply new ESG allocation weights
  async applyWeights(username, role, weights) {
    const res = await fetch(`${BASE_URL}/settings/weights`, {
      method: 'POST',
      headers: getHeaders(username, role),
      body: JSON.stringify(weights)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to apply weights');
    return data;
  }
};
