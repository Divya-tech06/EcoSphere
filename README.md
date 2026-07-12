# EcoSphere: Advanced ESG Management Platform

EcoSphere is a premium, state-of-the-art Environmental, Social, and Governance (ESG) management platform designed to track, audit, and showcase organizational sustainability metrics. The application provides end-to-end role-based workflows for tracking carbon emissions, proposing CSR initiatives, managing policy compliance, and viewing an immutable audit trail.

---

## 🌟 Key Accomplishments & Technical Features

### 👤 Tailored Role-Based Dashboards
The platform segregates workflows and UI widgets based on the logged-in user's role to ensure security, clean user experiences, and data access controls:
*   **Employee**: Submit carbon transactions, propose new CSR initiatives, sign off on active compliance policies, and view personal badges/XP.
*   **Manager**: Review and approve/reject carbon offset transactions, approve proposed CSR activities, and view department-level ESG aggregates.
*   **Compliance Officer**: Manage active policy documents, issue warning notices, audit departments, and sign off on governance ledgers.
*   **Administrator**: Full system operations, including user administration, departments configuration, core settings weights adjustment, and database connection driver logs.

### 🛡️ CSR Activity Proposed Workflow Integration
*   Developed a seamless, multi-step proposal workflow where employees propose initiatives (like Rooftop Solar Workshops or river clean-ups).
*   Built real-time backend serialization handling in the `/api/csr/propose` route to gracefully convert participant arrays/objects into comma-separated strings for database persistence.
*   Enabled Manager-level approvals and Employee-level joining/evidence file upload mechanisms with persistent storage.

### 📊 Immutable Audit Ledger & Double-Entry Tracking
*   Centralized logging for every major action (e.g. CSR Proposals, Compliance Policies signed, Carbon Offset additions) recorded to a transparent, searchable Audit Ledger.
*   Provides robust verification for compliance officers and external auditors.

### 🗄️ Dual-Driver Database Architecture
*   Designed to work out-of-the-box in two database modes:
    *   **Primary Cloud**: MongoDB Atlas via Mongoose.
    *   **Local Fallback**: SQLite via Sequelize (runs automatically if MongoDB is unreachable or unconfigured).
*   Built database-agnostic repository methods ensuring perfect schema consistency across NoSQL and SQL drivers.

---

## 🚀 Getting Started

### 📋 Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)

### ⚙️ Environment Configuration
1. Create a `.env` file in the root directory:
   ```env
   # MongoDB Atlas Connection URI
   MONGODB_URI=your_mongodb_connection_string
   ```
   *Note: If no `.env` file or `MONGODB_URI` is provided, the platform automatically initializes in local fallback mode using a local `db.sqlite` file.*

### 🛠️ Installation & Execution
1. Clone the repository:
   ```bash
   git clone https://github.com/Divya-tech06/EcoSphere.git
   cd EcoSphere
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run both the backend Express server (port `5001`) and the Vite frontend server concurrently:
   ```bash
   npm run dev-all
   ```
4. Access the web app at the local address printed by Vite (typically `http://localhost:5173` or similar).

---

## 🔑 Demo Login Credentials
To test the end-to-end user lifecycle across all roles, use these pre-seeded credentials (all passwords are `password123`):

| Role | Username / Email | Duty Description |
| :--- | :--- | :--- |
| **Admin** | `admin@ecosphere.com` | Full system control, switches database driver, manages users. |
| **Manager** | `manager@ecosphere.com` | Approves emissions offsets and CSR proposals. |
| **Compliance Officer** | `compliance@ecosphere.com` | Tracks corporate policy, signs ledger, issues warnings. |
| **Employee** | `employee@ecosphere.com` | Submits transactions, proposes CSR activities, signs policies. |

---

## 💎 Project Advantages
*   **Data Integrity**: Built-in array and object sanitization prevents database serialization crashes.
*   **Security & Guardrails**: Enforced backend middleware verifies role clearances for all REST API endpoints.
*   **Premium Aesthetics**: Rich, modern glassmorphic theme with customizable dark/light modes.
*   **Resiliency**: Automated database failovers keep the system active in any environment.
