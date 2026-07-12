export const initialDepartments = [
  { id: "dept-1", name: "Operations & Production", code: "OPS", manager: "Sarah Connor", totalEmployees: 45, envScore: 82, socScore: 78, govScore: 85, esgScore: 81.3 },
  { id: "dept-2", name: "Logistics & Fleet", code: "LOG", manager: "Marcus Wright", totalEmployees: 32, envScore: 64, socScore: 70, govScore: 78, esgScore: 70.0 },
  { id: "dept-3", name: "Facilities & Real Estate", code: "FAC", manager: "John Connor", totalEmployees: 18, envScore: 88, socScore: 82, govScore: 90, esgScore: 86.8 },
  { id: "dept-4", name: "Human Resources", code: "HR", manager: "Kyle Reese", totalEmployees: 12, envScore: 92, socScore: 95, govScore: 94, esgScore: 93.5 },
  { id: "dept-5", name: "Research & Development", code: "RND", manager: "Dr. Peter Silberman", totalEmployees: 25, envScore: 86, socScore: 88, govScore: 92, esgScore: 88.4 }
];

export const initialEmissionFactors = [
  { id: "ef-1", activityType: "Fleet (Diesel)", unit: "Liters", co2PerUnit: 2.68 },
  { id: "ef-2", activityType: "Fleet (Petrol)", unit: "Liters", co2PerUnit: 2.31 },
  { id: "ef-3", activityType: "Manufacturing (Gas)", unit: "kWh", co2PerUnit: 0.18 },
  { id: "ef-4", activityType: "Electricity (Grid)", unit: "kWh", co2PerUnit: 0.85 },
  { id: "ef-5", activityType: "Air Travel (Business)", unit: "km", co2PerUnit: 0.11 }
];

export const initialBadges = [
  { id: "badge-1", name: "Eco Guardian", description: "Reach a personal score of 200 XP through CSR and Challenges", xpRequirement: 200, unlockRuleType: "XP", icon: "Leaf", unlocked: false },
  { id: "badge-2", name: "Carbon Zero Hero", description: "Successfully complete 3 Carbon Reduction Challenges", xpRequirement: 0, unlockRuleType: "Challenges Completed", unlockRuleValue: 3, icon: "Zap", unlocked: false },
  { id: "badge-3", name: "Compliance Champion", description: "Acknowledge all active governance policies", xpRequirement: 0, unlockRuleType: "Policies Signed", unlockRuleValue: 4, icon: "Award", unlocked: false },
  { id: "badge-4", name: "CSR Advocate", description: "Participate in at least 2 Corporate Social Responsibility events", xpRequirement: 0, unlockRuleType: "CSR Participations", unlockRuleValue: 2, icon: "Users", unlocked: false },
  { id: "badge-5", name: "Sustainability Champion", description: "Earn 1000 total XP to unlock this elite status badge", xpRequirement: 1000, unlockRuleType: "XP", icon: "Trophy", unlocked: false }
];

export const initialRewards = [
  { id: "rew-1", title: "Eco-Friendly Cork Water Bottle", pointsCost: 200, stockAvailable: 14, imagePlaceholder: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=200", category: "Eco Gear" },
  { id: "rew-2", title: "Solar Powered Pocket Charger", pointsCost: 500, stockAvailable: 6, imagePlaceholder: "https://images.unsplash.com/photo-1617791160505-6f006e121980?auto=format&fit=crop&q=80&w=200", category: "Tech" },
  { id: "rew-3", title: "Organic Canvas Tote Bag", pointsCost: 100, stockAvailable: 45, imagePlaceholder: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200", category: "Eco Gear" },
  { id: "rew-4", title: "Plant a Tree in Your Name", pointsCost: 150, stockAvailable: 100, imagePlaceholder: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=200", category: "Donation" },
  { id: "rew-5", title: "Zero-Waste Lunchbox Set", pointsCost: 350, stockAvailable: 12, imagePlaceholder: "https://images.unsplash.com/photo-1599690925058-90e1a0b4bd3a?auto=format&fit=crop&q=80&w=200", category: "Eco Gear" }
];

export const initialCarbonTransactions = [
  { id: "tx-1", date: "2026-07-01", sourceRef: "EXP-98122", activityType: "Electricity (Grid)", quantity: 15200, calculatedCo2: 12920, autoCalculated: true, departmentId: "dept-3" },
  { id: "tx-2", date: "2026-07-03", sourceRef: "PO-77865", activityType: "Fleet (Diesel)", quantity: 2400, calculatedCo2: 6432, autoCalculated: true, departmentId: "dept-2" },
  { id: "tx-3", date: "2026-07-05", sourceRef: "MFG-22104", activityType: "Manufacturing (Gas)", quantity: 45000, calculatedCo2: 8100, autoCalculated: true, departmentId: "dept-1" },
  { id: "tx-4", date: "2026-07-08", sourceRef: "EXP-98311", activityType: "Air Travel (Business)", quantity: 12500, calculatedCo2: 1375, autoCalculated: true, departmentId: "dept-5" },
  { id: "tx-5", date: "2026-07-10", sourceRef: "PO-78012", activityType: "Fleet (Petrol)", quantity: 850, calculatedCo2: 1963.5, autoCalculated: false, departmentId: "dept-2" }
];

export const initialCsrActivities = [
  { id: "csr-1", title: "Local Park Cleanup Drive", description: "Join us in cleaning and restoring the local community park. Operations department will lead this initiative.", date: "2026-07-15", maxParticipants: 30, pointsValue: 150, xpValue: 150, participants: ["Sarah Connor", "John Connor", "Kyle Reese"], status: "Approved", evidenceFileAttached: true, evidenceFileName: "park_cleanup_receipt.jpg", departmentId: "dept-1" },
  { id: "csr-2", title: "E-Waste Recycling Camp", description: "Collect and safely dispose of outdated office electronics and team devices.", date: "2026-07-19", maxParticipants: 15, pointsValue: 100, xpValue: 100, participants: ["Marcus Wright", "Kate Brewster"], status: "Approved", evidenceFileAttached: true, evidenceFileName: "ewaste_certificate.pdf", departmentId: "dept-5" },
  { id: "csr-3", title: "Community Tree Planting", description: "Afforestation project aiming to plant 500 saplings in the urban zone.", date: "2026-07-22", maxParticipants: 50, pointsValue: 200, xpValue: 200, participants: ["Sarah Connor"], status: "Pending", evidenceFileAttached: false, evidenceFileName: "", departmentId: "dept-1" },
  { id: "csr-4", title: "Eco-Design Hackathon", description: "Design low-carbon product solutions for our core manufacturing clients.", date: "2026-07-28", maxParticipants: 20, pointsValue: 250, xpValue: 250, participants: ["Dr. Peter Silberman", "John Connor"], status: "Pending", evidenceFileAttached: false, evidenceFileName: "", departmentId: "dept-5" }
];

export const initialChallenges = [
  { id: "ch-1", name: "Zero Commuter Footprint", targetMetric: "CSR participation", targetValue: 3, rewardPoints: 200, rewardXP: 200, difficulty: "Medium", endDate: "2026-07-25", status: "Active", category: "Social" },
  { id: "ch-2", name: "Minimize Operations Gas Burn", targetMetric: "Carbon reduction", targetValue: 5000, rewardPoints: 300, rewardXP: 300, difficulty: "Hard", endDate: "2026-07-31", status: "Active", category: "Environmental" },
  { id: "ch-3", name: "Annual Compliance Fast-Track", targetMetric: "Policy signoff", targetValue: 4, rewardPoints: 150, rewardXP: 150, difficulty: "Easy", endDate: "2026-07-15", status: "Active", category: "Governance" },
  { id: "ch-4", name: "Fleet Electrification Phase 1", targetMetric: "Carbon reduction", targetValue: 8000, rewardPoints: 400, rewardXP: 400, difficulty: "Hard", endDate: "2026-06-30", status: "Completed", category: "Environmental" },
  { id: "ch-5", name: "Green Facility Upgrades", targetMetric: "Carbon reduction", targetValue: 12000, rewardPoints: 500, rewardXP: 500, difficulty: "Hard", endDate: "2026-08-15", status: "Draft", category: "Environmental" }
];

export const initialComplianceIssues = [
  { id: "ci-1", title: "Unreported Hazardous Material Waste", description: "Logistics department failed to log standard waste manifests for the June manufacturing run.", severity: "High", status: "Open", owner: "Marcus Wright", dueDate: "2026-07-05", auditName: "Q2 Operations Review" },
  { id: "ci-2", title: "Server Room HVAC Overheating", description: "Facilities department server HVAC system is running below environmental efficiency threshold (EER < 10).", severity: "Medium", status: "Open", owner: "John Connor", dueDate: "2026-07-20", auditName: "Green Facility Audit" },
  { id: "ci-3", title: "Supplier Code of Conduct Missing", description: "Three core logistical suppliers haven't signed the updated Supplier Ethics and Anti-Bribery agreement.", severity: "Low", status: "Open", owner: "Marcus Wright", dueDate: "2026-07-28", auditName: "Annual Partner Audit" },
  { id: "ci-4", title: "GDPR Employee Consent Review", description: "Internal employee records lack signed data treatment notices for new logistics staff.", severity: "Medium", status: "Resolved", owner: "Kyle Reese", dueDate: "2026-06-15", auditName: "Q1 Information Governance Audit" }
];

export const initialPolicyAcknowledgements = [
  { id: "pol-1", policyName: "Code of Sustainability and Environmental Ethics", totalEmployees: 122, acknowledgedCount: 110, acknowledgedEmployees: ["Sarah Connor", "John Connor", "Kyle Reese", "Marcus Wright", "Dr. Peter Silberman", "Kate Brewster"] },
  { id: "pol-2", policyName: "Anti-Bribery and Fair Logistics Policy", totalEmployees: 122, acknowledgedCount: 95, acknowledgedEmployees: ["Sarah Connor", "Marcus Wright", "Kyle Reese", "Dr. Peter Silberman"] },
  { id: "pol-3", policyName: "Equal Opportunity and Inclusive Workplace Mandate", totalEmployees: 122, acknowledgedCount: 118, acknowledgedEmployees: ["Sarah Connor", "John Connor", "Kyle Reese", "Marcus Wright", "Dr. Peter Silberman", "Kate Brewster"] },
  { id: "pol-4", policyName: "Supply Chain Traceability and Human Rights Code", totalEmployees: 122, acknowledgedCount: 82, acknowledgedEmployees: ["Sarah Connor", "John Connor", "Kyle Reese"] }
];

export const initialNotifications = [
  { id: "notif-1", type: "badge", title: "Badge Unlocked!", message: "Congratulations! You have unlocked the 'Compliance Champion' badge.", time: "1 hour ago", read: false },
  { id: "notif-2", type: "compliance", title: "Compliance Alert", message: "Issue 'Unreported Hazardous Material Waste' assigned to Marcus Wright is OVERDUE (Due: 2026-07-05).", time: "2 hours ago", read: false },
  { id: "notif-3", type: "csr", title: "CSR Activity Approved", message: "Your cleanup activity 'Local Park Cleanup Drive' has been approved by admin.", time: "1 day ago", read: true }
];

export const mockEmployees = [
  "Sarah Connor",
  "John Connor",
  "Kyle Reese",
  "Marcus Wright",
  "Dr. Peter Silberman",
  "Kate Brewster"
];
