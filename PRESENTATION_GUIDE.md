# EcoSphere ESG Platform - Video Presentation Script 🎙️

This script is structured for a high-impact, professional video presentation. It walks through all **4 distinct roles** (Employee, Manager, Compliance Officer, and Admin) and explains the **underlying technology stack** in detail.

---

## 🛠️ Step 1: Pre-Video Demo Setup
To present the roles without logging in and out constantly, open **four browser windows or tabs** pre-configured for each user:

| Tab | User / Role | Credentials | Focus of Demo |
| :--- | :--- | :--- | :--- |
| **Tab 1** | **John Doe** (Employee) | `employee@ecosphere.com` / `password123` | Gamification, volunteer signs, and offsets submission. |
| **Tab 2** | **John Connor** (Manager) | `manager@ecosphere.com` / `password123` | Direct carbon logging, offset review, and CSR approvals. |
| **Tab 3** | **Ellen Ripley** (Compliance Officer) | `compliance@ecosphere.com` / `password123` | Compliance issues tracking, overdue alarms, and policies. |
| **Tab 4** | **Sarah Connor** (Admin) | `admin@ecosphere.com` / `password123` | User directory, department setup, settings, and ESG weights. |

---

## 🎬 Video Recording Script & Visual Flow

### 📣 PART 1: INTRODUCTION & TECH STACK OVERVIEW (0:00 - 1:15)

* **Visual**: Show the dark-themed **Landing Page** (`http://localhost:5173/`). Slowly scroll down to show the module grid card hover states.
* **Action**: Move mouse pointer smoothly over the Environmental, Social, Governance, and Gamification cards.

> **[SPOKEN SCRIPT]**
> *"Hello everyone! Today, I am excited to present **EcoSphere**—a next-generation ESG and Sustainability ERP Platform designed to bridge day-to-day enterprise operations with real-time ESG metrics. 
> 
> Traditional ERP platforms track financials and physical inventory, but EcoSphere tracks carbon output, compliance risk, and community impact in a single integrated portal.
> 
> Let's discuss the technology stack powering this application:
> * On the **Frontend**, we use **React 19** paired with **Vite** for lightning-fast hot-reloads and optimized builds, along with **Tailwind CSS v4** for clean, modern glassmorphic styles and custom UI animations.
> * On the **Backend**, a robust **Node.js Express** API acts as our central engine.
> * For the database, we have engineered a **dual-driver database model**. The system operates on a NoSQL **MongoDB Atlas cluster** via Mongoose, and automatically falls back to a local **SQLite** database via Sequelize if offline or during local testing, ensuring zero downtime and deployment flexibility.
> 
> Let's sign in to explore how the platform serves different stakeholders in an organization through four specialized roles."*

---

### 👤 PART 2: THE EMPLOYEE WORKFLOW - John Doe (1:15 - 2:30)

* **Visual**: Switch to **Tab 1** (Logged in as **John Doe**). You are on the Dashboard.
* **Action**: Click on **Green Rewards** in the sidebar. Point to the XP (100) and Green Points (200) indicators at the top.
* **Action**: Scroll down to the Marketplace. Click **Redeem** on the *"Eco-Friendly Cork Water Bottle"* (Cost: 200 points).
* **Visual**: Watch the points balance reduce to `0` instantly, a success toast notify you, and the stock of the item decrease.
* **Action**: Navigate to the **CSR Activities** tab. Show the active activities list.

> **[SPOKEN SCRIPT]**
> *"We start with the **Employee perspective**, logged in as John Doe. EcoSphere promotes a bottom-up sustainability culture by gamifying eco-friendly choices. 
> 
> Employees have access to a dedicated dashboard displaying their accumulated experience points (XP) and redeemable Green Points. In the Green Rewards marketplace, employees can redeem points for sustainable rewards like tree planting certificates or lifestyle products. 
> 
> Let's redeem this Eco-Friendly Cork Water Bottle. As I click redeem, the application executes a backend balance-check, updates the inventory, and deducts my points in real-time.
> 
> Under the CSR Activities tab, employees can see proposed volunteering drives, view detail checklists, and register their participation with one click to earn more rewards."*

---

### 👔 PART 3: THE MANAGER WORKFLOW - John Connor (2:30 - 4:00)

* **Visual**: Switch to **Tab 2** (Logged in as **John Connor**). Show the Dashboard.
* **Action**: Scroll down to the **ERP Operations Simulator** on the Dashboard.
* **Action**: Enter a new carbon transaction:
  * Select **Electricity** (Scope 2).
  * Enter quantity: `3000` kWh.
  * Enter description: `Warehouse Section B HVAC Run`.
  * Click **Calculate & Log Emissions**.
* **Visual**: Notice the immediate update of the carbon charts and overall ESG scores on the dashboard.
* **Action**: Go to the **CSR Activities** tab. Show the proposed tree-planting event from employees.
* **Action**: Click **Approve** on a pending CSR activity that has evidence uploaded.

> **[SPOKEN SCRIPT]**
> *"Next, we look at the **Manager's workflow**, logged in as John Connor. Managers are responsible for logging direct operational data and reviewing contributions.
> 
> On the dashboard, managers have access to the ERP Operations Simulator. Let's log an electricity purchase of 3,000 Kilowatt-hours. With automated calculations active, the platform multiplies the quantity by our Scope 2 electricity factor. The transaction is instantly stored, the emissions graph spikes, and the department's environmental score recalculates.
> 
> Managers also act as auditors. When employees complete a CSR activity or submit carbon offset credits, managers review them. If the platform's 'Evidence Requirement' toggle is active, managers can only approve activities once employees upload verification receipts or photos, securing the system against database exploitation."*

---

### 🛡️ PART 4: THE COMPLIANCE OFFICER WORKFLOW - Ellen Ripley (4:00 - 5:15)

* **Visual**: Switch to **Tab 3** (Logged in as **Ellen Ripley**). Click on the **Compliance Hub** tab.
* **Visual**: Point at the flashing **"OVERDUE"** alarm badge next to one of the compliance items.
* **Action**: Click on **Audit Ledger** in the sidebar. Scroll through the logs showing timestamps, users, and detailed actions.

> **[SPOKEN SCRIPT]**
> *"Now let's switch to the **Compliance Officer**, Ellen Ripley. In ESG, governance and regulatory compliance are critical. 
> 
> Under the Compliance Hub, compliance officers monitor active regulatory infractions and audit reports. Notice the flashing 'OVERDUE' warning badges. These appear automatically when a ticket’s due date has passed. The moment a compliance officer resolves an issue, the department's Governance score rises in the background.
> 
> Compliance officers also require an immutable record of company activity. EcoSphere captures every system event—from user logons to policy acknowledgement signatures—and renders them in this detailed, paginated Audit Ledger. This maintains complete transparency for external audits."*

---

### ⚙️ PART 5: THE ADMIN WORKFLOW - Sarah Connor (5:15 - 6:45)

* **Visual**: Switch to **Tab 4** (Logged in as **Sarah Connor**). Click on **ESG Settings** in the sidebar.
* **Action**: Adjust the **Environmental Weight** slider to `50%`, **Social** to `25%`, and **Governance** to `25%`. Click **Apply Weightings**.
* **Visual**: Watch the success toast show up, indicating department scores have synced under the new weights.
* **Action**: Click on **User Directory** and **Departments Manager** tabs to show lists of users and departments.

> **[SPOKEN SCRIPT]**
> *"Finally, we look at the **System Administrator**, Sarah Connor. Admins control user permissions, create new departments, and tune the ESG calculation weights.
> 
> Let's look at the Settings panel. An admin can change how the global ESG score is calculated. If our company prioritizes environmental factors, we can adjust the sliders—setting Environmental to 50%, Social to 25%, and Governance to 25%. Once I hit 'Apply Weightings', the backend instantly triggers an ESG recalculation across all divisions.
> 
> Admins can also toggle business logic constraints, such as forcing evidence attachments or enabling automatic badge-award rules. Under the User Directory and Departments tabs, admins maintain complete control over the organization's structure."*

---

### 🎬 PART 6: CONCLUSION (6:45 - End)

* **Visual**: Switch back to the landing page or the main Admin Dashboard showing all charts updated.
* **Action**: End with a smooth scroll showing the dark mode theme toggle (click the moon icon to toggle light/dark modes).

> **[SPOKEN SCRIPT]**
> *"In summary, EcoSphere represents a complete corporate sustainability solution. By offering dedicated interfaces for Employees, Managers, Compliance Officers, and Admins, it fosters transparency and accountability. 
> 
> Powered by modern technologies like React 19, Node.js, MongoDB, and SQLite, EcoSphere is ready to scale. Thank you for your time!"*
