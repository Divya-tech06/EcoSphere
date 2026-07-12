import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// ---------------- DATABASE CONFIGURATION ----------------

const MONGODB_URI = process.env.MONGODB_URI || ''; 
let DATABASE_TYPE = (process.env.MONGODB_URI || MONGODB_URI) ? 'mongodb' : 'sqlite';

console.log(`>>> EcoSphere launching database driver mode: ${DATABASE_TYPE.toUpperCase()}`);

// ---------------- SQL (SEQUELIZE/SQLITE) CONNECTION ----------------
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false
});

// ---------------- SQL MODELS DEFINITIONS ----------------
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'Employee' }, // 'Admin', 'Manager', 'Compliance Officer', 'Employee'
  xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  points: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Department = sequelize.define('Department', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false },
  manager: { type: DataTypes.STRING, allowNull: false },
  envScore: { type: DataTypes.INTEGER, defaultValue: 95 },
  socScore: { type: DataTypes.INTEGER, defaultValue: 70 },
  govScore: { type: DataTypes.INTEGER, defaultValue: 95 },
  esgScore: { type: DataTypes.FLOAT, defaultValue: 85.0 }
});

const EmissionFactor = sequelize.define('EmissionFactor', {
  id: { type: DataTypes.STRING, primaryKey: true },
  source: { type: DataTypes.STRING, allowNull: false },
  factor: { type: DataTypes.FLOAT, allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false },
  scope: { type: DataTypes.STRING, allowNull: false }
});

const CarbonTransaction = sequelize.define('CarbonTransaction', {
  id: { type: DataTypes.STRING, primaryKey: true },
  date: { type: DataTypes.STRING, allowNull: false },
  sourceRef: { type: DataTypes.STRING, allowNull: false },
  activityType: { type: DataTypes.STRING, allowNull: false },
  scope: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false },
  calculatedCo2: { type: DataTypes.FLOAT, allowNull: false },
  departmentId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Approved' }, // 'Pending', 'Approved', 'Rejected'
  proofDescription: { type: DataTypes.TEXT, defaultValue: '' },
  proofUrl: { type: DataTypes.TEXT, defaultValue: '' },
  submittedBy: { type: DataTypes.STRING, defaultValue: '' }
});

const CsrActivity = sequelize.define('CsrActivity', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.STRING, allowNull: false },
  maxParticipants: { type: DataTypes.INTEGER },
  pointsValue: { type: DataTypes.INTEGER, defaultValue: 100 },
  xpValue: { type: DataTypes.INTEGER, defaultValue: 100 },
  participants: { type: DataTypes.TEXT, defaultValue: '' }, 
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }, 
  evidenceFileAttached: { type: DataTypes.BOOLEAN, defaultValue: false },
  evidenceFileName: { type: DataTypes.STRING, defaultValue: '' },
  departmentId: { type: DataTypes.STRING }
});

const Challenge = sequelize.define('Challenge', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  targetMetric: { type: DataTypes.STRING },
  targetValue: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  endDate: { type: DataTypes.STRING },
  rewardPoints: { type: DataTypes.INTEGER, defaultValue: 100 }
});

const ComplianceIssue = sequelize.define('ComplianceIssue', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Open' }, 
  owner: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.STRING },
  auditName: { type: DataTypes.STRING }
});

const PolicyAcknowledgement = sequelize.define('PolicyAcknowledgement', {
  id: { type: DataTypes.STRING, primaryKey: true },
  policyName: { type: DataTypes.STRING, allowNull: false },
  totalEmployees: { type: DataTypes.INTEGER, defaultValue: 4 },
  acknowledgedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  acknowledgedEmployees: { type: DataTypes.TEXT, defaultValue: '' } 
});

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.STRING, primaryKey: true },
  timestamp: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT }
});


// ---------------- NOSQL (MONGOOSE/MONGODB) CONNECTION & SCHEMAS ----------------
if (DATABASE_TYPE === 'mongodb') {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('>>> EcoSphere connected to MongoDB successfully.');
      seedDatabase();
    })
    .catch((e) => {
      console.error('>>> MongoDB connection failed. Falling back to local SQLite...', e.message);
      DATABASE_TYPE = 'sqlite';
      seedDatabase();
    });
}

const MongoUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Employee' },
  xp: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { timestamps: true });

const MongoUser = mongoose.models.User || mongoose.model('User', MongoUserSchema);

const MongoDepartmentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  manager: { type: String, required: true },
  envScore: { type: Number, default: 95 },
  socScore: { type: Number, default: 70 },
  govScore: { type: Number, default: 95 },
  esgScore: { type: Number, default: 85.0 }
});

const MongoDepartment = mongoose.models.Department || mongoose.model('Department', MongoDepartmentSchema);

const MongoEmissionFactorSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  source: { type: String, required: true },
  factor: { type: Number, required: true },
  unit: { type: String, required: true },
  scope: { type: String, required: true }
});

const MongoEmissionFactor = mongoose.models.EmissionFactor || mongoose.model('EmissionFactor', MongoEmissionFactorSchema);

const MongoCarbonTransactionSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  sourceRef: { type: String, required: true },
  activityType: { type: String, required: true },
  scope: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  calculatedCo2: { type: Number, required: true },
  departmentId: { type: String, required: true },
  status: { type: String, default: 'Approved' },
  proofDescription: { type: String, default: '' },
  proofUrl: { type: String, default: '' },
  submittedBy: { type: String, default: '' }
}, { timestamps: true });

const MongoCarbonTransaction = mongoose.models.CarbonTransaction || mongoose.model('CarbonTransaction', MongoCarbonTransactionSchema);

const MongoCsrActivitySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  maxParticipants: { type: Number },
  pointsValue: { type: Number, default: 100 },
  xpValue: { type: Number, default: 100 },
  participants: { type: String, default: '' },
  status: { type: String, default: 'Pending' },
  evidenceFileAttached: { type: Boolean, default: false },
  evidenceFileName: { type: String, default: '' },
  departmentId: { type: String }
}, { timestamps: true });

const MongoCsrActivity = mongoose.models.CsrActivity || mongoose.model('CsrActivity', MongoCsrActivitySchema);

const MongoChallengeSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  targetMetric: { type: String },
  targetValue: { type: String },
  difficulty: { type: String },
  status: { type: String, default: 'Active' },
  endDate: { type: String },
  rewardPoints: { type: Number, default: 100 }
});

const MongoChallenge = mongoose.models.Challenge || mongoose.model('Challenge', MongoChallengeSchema);

const MongoComplianceIssueSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String },
  status: { type: String, default: 'Open' },
  owner: { type: String },
  dueDate: { type: String },
  auditName: { type: String }
}, { timestamps: true });

const MongoComplianceIssue = mongoose.models.ComplianceIssue || mongoose.model('ComplianceIssue', MongoComplianceIssueSchema);

const MongoPolicyAcknowledgementSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  policyName: { type: String, required: true },
  totalEmployees: { type: Number, default: 4 },
  acknowledgedCount: { type: Number, default: 0 },
  acknowledgedEmployees: { type: String, default: '' }
});

const MongoPolicyAcknowledgement = mongoose.models.PolicyAcknowledgement || mongoose.model('PolicyAcknowledgement', MongoPolicyAcknowledgementSchema);

const MongoAuditLogSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  timestamp: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String }
});

const MongoAuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', MongoAuditLogSchema);


// ---------------- REPOSITORY WRAPPERS BLOCK ----------------
const DB = {
  User: {
    findOne: async (query) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.findOne(query);
      } else {
        return await User.findOne({ where: query });
      }
    },
    findAll: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.find({});
      } else {
        return await User.findAll();
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.create(data);
      } else {
        return await User.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.countDocuments();
      } else {
        return await User.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.insertMany(data);
      } else {
        return await User.bulkCreate(data);
      }
    },
    destroy: async (query) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoUser.deleteOne(query);
      } else {
        return await User.destroy({ where: query });
      }
    }
  },

  Department: {
    findOne: async (query) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoDepartment.findOne(query);
      } else {
        return await Department.findOne({ where: query });
      }
    },
    findAll: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoDepartment.find({});
      } else {
        return await Department.findAll();
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoDepartment.create(data);
      } else {
        return await Department.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoDepartment.countDocuments();
      } else {
        return await Department.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoDepartment.insertMany(data);
      } else {
        return await Department.bulkCreate(data);
      }
    }
  },

  EmissionFactor: {
    findAll: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoEmissionFactor.find({});
      } else {
        return await EmissionFactor.findAll();
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoEmissionFactor.countDocuments();
      } else {
        return await EmissionFactor.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoEmissionFactor.insertMany(data);
      } else {
        return await EmissionFactor.bulkCreate(data);
      }
    }
  },

  CarbonTransaction: {
    findOne: async (query) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCarbonTransaction.findOne(query);
      } else {
        return await CarbonTransaction.findOne({ where: query });
      }
    },
    findByPk: async (id) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCarbonTransaction.findOne({ id });
      } else {
        return await CarbonTransaction.findByPk(id);
      }
    },
    findAll: async (opts = {}) => {
      if (DATABASE_TYPE === 'mongodb') {
        let query = MongoCarbonTransaction.find({});
        if (opts.order) {
          query = query.sort({ createdAt: -1 });
        }
        return await query;
      } else {
        return await CarbonTransaction.findAll(opts);
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCarbonTransaction.create(data);
      } else {
        return await CarbonTransaction.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCarbonTransaction.countDocuments();
      } else {
        return await CarbonTransaction.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCarbonTransaction.insertMany(data);
      } else {
        return await CarbonTransaction.bulkCreate(data);
      }
    }
  },

  CsrActivity: {
    findAll: async (opts = {}) => {
      if (DATABASE_TYPE === 'mongodb') {
        let query = MongoCsrActivity.find({});
        if (opts.order) {
          query = query.sort({ createdAt: -1 });
        }
        return await query;
      } else {
        return await CsrActivity.findAll(opts);
      }
    },
    findByPk: async (id) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCsrActivity.findOne({ id });
      } else {
        return await CsrActivity.findByPk(id);
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCsrActivity.create(data);
      } else {
        return await CsrActivity.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCsrActivity.countDocuments();
      } else {
        return await CsrActivity.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoCsrActivity.insertMany(data);
      } else {
        return await CsrActivity.bulkCreate(data);
      }
    }
  },

  Challenge: {
    findAll: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoChallenge.find({});
      } else {
        return await Challenge.findAll();
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoChallenge.countDocuments();
      } else {
        return await Challenge.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoChallenge.insertMany(data);
      } else {
        return await Challenge.bulkCreate(data);
      }
    }
  },

  ComplianceIssue: {
    findAll: async (opts = {}) => {
      if (DATABASE_TYPE === 'mongodb') {
        let query = MongoComplianceIssue.find({});
        if (opts.order) {
          query = query.sort({ createdAt: -1 });
        }
        return await query;
      } else {
        return await ComplianceIssue.findAll(opts);
      }
    },
    findByPk: async (id) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoComplianceIssue.findOne({ id });
      } else {
        return await ComplianceIssue.findByPk(id);
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoComplianceIssue.create(data);
      } else {
        return await ComplianceIssue.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoComplianceIssue.countDocuments();
      } else {
        return await ComplianceIssue.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoComplianceIssue.insertMany(data);
      } else {
        return await ComplianceIssue.bulkCreate(data);
      }
    }
  },

  PolicyAcknowledgement: {
    findAll: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoPolicyAcknowledgement.find({});
      } else {
        return await PolicyAcknowledgement.findAll();
      }
    },
    findByPk: async (id) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoPolicyAcknowledgement.findOne({ id });
      } else {
        return await PolicyAcknowledgement.findByPk(id);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoPolicyAcknowledgement.countDocuments();
      } else {
        return await PolicyAcknowledgement.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoPolicyAcknowledgement.insertMany(data);
      } else {
        return await PolicyAcknowledgement.bulkCreate(data);
      }
    }
  },

  AuditLog: {
    findAll: async (opts = {}) => {
      if (DATABASE_TYPE === 'mongodb') {
        let query = MongoAuditLog.find({});
        if (opts.order) {
          query = query.sort({ timestamp: -1 });
        }
        return await query;
      } else {
        return await AuditLog.findAll(opts);
      }
    },
    create: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoAuditLog.create(data);
      } else {
        return await AuditLog.create(data);
      }
    },
    count: async () => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoAuditLog.countDocuments();
      } else {
        return await AuditLog.count();
      }
    },
    bulkCreate: async (data) => {
      if (DATABASE_TYPE === 'mongodb') {
        return await MongoAuditLog.insertMany(data);
      } else {
        return await AuditLog.bulkCreate(data);
      }
    }
  }
};


// ---------------- AUDIT LOGGER HELPER ----------------
const logAction = async (username, role, action, details) => {
  try {
    await DB.AuditLog.create({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      username,
      role,
      action,
      details
    });
  } catch (e) {
    console.error('AuditLog Error:', e);
  }
};

// ---------------- CALCULATIONS PIPELINE ----------------
const serverRecalculateEsg = async (weights = { env: 40, soc: 30, gov: 30 }) => {
  try {
    const depts = await DB.Department.findAll();
    const carbonTx = await DB.CarbonTransaction.findAll();
    const csrAct = await DB.CsrActivity.findAll();
    const compliance = await DB.ComplianceIssue.findAll();

    for (const d of depts) {
      // 1. Environmental Score calculations (ONLY include APPROVED transactions)
      const deptTx = carbonTx.filter(tx => tx.departmentId === d.id && tx.status === 'Approved');
      const deptCO2 = deptTx.reduce((acc, t) => acc + t.calculatedCo2, 0);
      const calculatedEnv = Math.max(30, Math.min(100, Math.round(95 - (deptCO2 / 1000))));

      // 2. Social Score calculations
      const deptCsrCount = csrAct.filter(act => act.departmentId === d.id && act.status === 'Approved').length;
      const calculatedSoc = Math.min(100, Math.round(70 + (deptCsrCount * 7)));

      // 3. Governance Score calculations
      const openIssuesCount = compliance.filter(ci => ci.owner === d.manager && ci.status === 'Open').length;
      const calculatedGov = Math.max(25, Math.min(100, Math.round(95 - (openIssuesCount * 12))));

      // Combined ESG Weighted score
      const totalWeight = weights.env + weights.soc + weights.gov;
      const weightedScore = parseFloat(
        ((calculatedEnv * weights.env + 
          calculatedSoc * weights.soc + 
          calculatedGov * weights.gov) / (totalWeight || 1)).toFixed(1)
      );

      d.envScore = calculatedEnv;
      d.socScore = calculatedSoc;
      d.govScore = calculatedGov;
      d.esgScore = weightedScore;
      
      await d.save();
    }
  } catch (e) {
    console.error('ESG Recalculation Engine Error:', e);
  }
};

// ---------------- SEED INITIAL DATABASE DATA ----------------
const seedDatabase = async () => {
  try {
    if (DATABASE_TYPE === 'sqlite') {
      await sequelize.sync({ force: false });
    }

    // Seed Departments
    const deptCount = await DB.Department.count();
    if (deptCount === 0) {
      await DB.Department.bulkCreate([
        { id: 'dept-1', name: 'Logistics & Fleet', code: 'LOG', manager: 'Sarah Connor', envScore: 82, socScore: 75, govScore: 90, esgScore: 82.3 },
        { id: 'dept-2', name: 'Manufacturing Ops', code: 'MFG', manager: 'John Connor', envScore: 68, socScore: 82, govScore: 60, esgScore: 69.8 },
        { id: 'dept-3', name: 'Facility Management', code: 'FAC', manager: 'Ellen Ripley', envScore: 88, socScore: 70, govScore: 95, esgScore: 84.7 },
        { id: 'dept-4', name: 'Corporate Relations', code: 'CORP', manager: 'James Carter', envScore: 94, socScore: 90, govScore: 95, esgScore: 93.1 }
      ]);
    }

    // Seed Emission Factors
    const efCount = await DB.EmissionFactor.count();
    if (efCount === 0) {
      await DB.EmissionFactor.bulkCreate([
        { id: 'ef-1', source: 'Fuel', factor: 2.68, unit: 'Liters', scope: 'Scope 1' },
        { id: 'ef-2', source: 'Electricity', factor: 0.85, unit: 'kWh', scope: 'Scope 2' },
        { id: 'ef-3', source: 'Flights', factor: 0.12, unit: 'Passenger-km', scope: 'Scope 3' }
      ]);
    }

    // Seed Challenges
    const chCount = await DB.Challenge.count();
    if (chCount === 0) {
      await DB.Challenge.bulkCreate([
        { id: 'ch-1', name: 'Zero Diesel Week', targetMetric: 'Direct Fuel Liters', targetValue: '0 Liters', difficulty: 'Hard', status: 'Active', endDate: '2026-07-15', rewardPoints: 300 },
        { id: 'ch-2', name: '100% Policy Cleanliness', targetMetric: 'Ethics Acknowledged', targetValue: '4 Signed', difficulty: 'Medium', status: 'Active', endDate: '2026-07-30', rewardPoints: 150 },
        { id: 'ch-3', name: 'Clean River Campaign', targetMetric: 'CSR Completed', targetValue: '1 Approved', difficulty: 'Easy', status: 'Completed', endDate: '2026-07-05', rewardPoints: 100 }
      ]);
    }

    // Seed Compliance
    const ciCount = await DB.ComplianceIssue.count();
    if (ciCount === 0) {
      await DB.ComplianceIssue.bulkCreate([
        { id: 'ci-1', title: 'Unreported Hazardous Material Waste', description: 'Chemical container stored behind facility wing D lacks environmental containments.', severity: 'High', status: 'Open', owner: 'Ellen Ripley', dueDate: '2026-07-05', auditName: 'Q2 Operations Review' },
        { id: 'ci-2', title: 'Incomplete Scope 2 Log Audits', description: 'Sub-meters in production line 3 not logging electrical draw metrics.', severity: 'Medium', status: 'Open', owner: 'John Connor', dueDate: '2026-07-20', auditName: 'Green Facility Audit' }
      ]);
    }

    // Seed Policies
    const polCount = await DB.PolicyAcknowledgement.count();
    if (polCount === 0) {
      await DB.PolicyAcknowledgement.bulkCreate([
        { id: 'pol-1', policyName: 'Platform Carbon Management Policy v1.4', totalEmployees: 4, acknowledgedCount: 2, acknowledgedEmployees: 'Sarah Connor,James Carter' },
        { id: 'pol-2', policyName: 'Conflict Free Minerals Ethics Charter', totalEmployees: 4, acknowledgedCount: 1, acknowledgedEmployees: 'Sarah Connor' }
      ]);
    }

    // Seed Carbon Transactions
    const txCount = await DB.CarbonTransaction.count();
    if (txCount === 0) {
      await DB.CarbonTransaction.bulkCreate([
        { id: 'tx-1', date: '2026-07-02', sourceRef: 'Fleet Diesel Refueling PO #804', activityType: 'Fuel', scope: 'Scope 1', quantity: 240, unit: 'Liters', calculatedCo2: 643, departmentId: 'dept-1', status: 'Approved' },
        { id: 'tx-2', date: '2026-07-05', sourceRef: 'HVAC Electric Bill Invoice #910', activityType: 'Electricity', scope: 'Scope 2', quantity: 1800, unit: 'kWh', calculatedCo2: 1530, departmentId: 'dept-3', status: 'Approved' },
        { id: 'tx-3', date: '2026-07-08', sourceRef: 'Operations Flight Munich to Tokyo', activityType: 'Flights', scope: 'Scope 3', quantity: 9500, unit: 'Passenger-km', calculatedCo2: 1140, departmentId: 'dept-2', status: 'Approved' }
      ]);
    }

    // Seed CSR Activities
    const csrCount = await DB.CsrActivity.count();
    if (csrCount === 0) {
      await DB.CsrActivity.bulkCreate([
        { id: 'csr-1', title: 'Riverfront Trash Clean-up', description: 'Removing plastic waste from local riverbank parks.', date: '2026-07-15', maxParticipants: 20, pointsValue: 120, xpValue: 120, participants: 'Sarah Connor,John Doe', status: 'Pending', evidenceFileAttached: false, evidenceFileName: '', departmentId: 'dept-4' },
        { id: 'csr-2', title: 'Rooftop Solar Maintenance Workshop', description: 'Assisting facility engineers in servicing roof panels.', date: '2026-07-22', maxParticipants: 10, pointsValue: 200, xpValue: 200, participants: 'Sarah Connor', status: 'Pending', evidenceFileAttached: true, evidenceFileName: 'solar_panel_proof.jpg', departmentId: 'dept-3' }
      ]);
    }

    // Seed Initial Audits
    const auditCount = await DB.AuditLog.count();
    if (auditCount === 0) {
      await DB.AuditLog.bulkCreate([
        { id: 'log-1', timestamp: new Date().toISOString(), username: 'System', role: 'System', action: 'Database Seeded', details: `Initialized ${DATABASE_TYPE} schema & seeded defaults.` }
      ]);
    }

    // Seed Default Users across all four roles
    const defaultUsers = [
      { username: 'Sarah Connor', email: 'admin@ecosphere.com', role: 'Admin', xp: 250, points: 500 },
      { username: 'John Connor', email: 'manager@ecosphere.com', role: 'Manager', xp: 150, points: 350 },
      { username: 'Ellen Ripley', email: 'compliance@ecosphere.com', role: 'Compliance Officer', xp: 180, points: 400 },
      { username: 'John Doe', email: 'employee@ecosphere.com', role: 'Employee', xp: 100, points: 200 }
    ];

    const hashedAdminPassword = await bcrypt.hash('password123', 10);

    for (const u of defaultUsers) {
      const existsByUsername = await DB.User.findOne({ username: u.username });
      const existsByEmail = await DB.User.findOne({ email: u.email });
      if (!existsByUsername && !existsByEmail) {
        await DB.User.create({
          username: u.username,
          email: u.email,
          password: hashedAdminPassword,
          role: u.role,
          xp: u.xp,
          points: u.points
        });
      }
    }

    console.log(`EcoSphere ${DATABASE_TYPE} database successfully synced and seeded.`);
  } catch (e) {
    console.error('Database seeding failed:', e);
  }
};

if (DATABASE_TYPE === 'sqlite') {
  seedDatabase();
}

// ---------------- REST API MIDDLWARE ENFORCEMENTS ----------------

const requireAuth = async (req, res, next) => {
  const username = req.headers['x-username'];
  if (!username) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }

  const user = await DB.User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User session not found.' });
  }

  req.auth = { user, role: user.role };
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.auth.role !== 'Admin') {
    return res.status(403).json({ error: 'Access Denied: Admin authorization required.' });
  }
  next();
};

const requireManager = (req, res, next) => {
  if (req.auth.role !== 'Manager' && req.auth.role !== 'Admin') {
    return res.status(403).json({ error: 'Access Denied: Managers or ESG auditors authorization required.' });
  }
  next();
};

// ---------------- AUTH REST ENDPOINTS ----------------

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please enter all details.' });
  }

  try {
    const userExists = await DB.User.findOne({ username });
    const emailExists = await DB.User.findOne({ email });
    if (userExists || emailExists) {
      return res.status(400).json({ error: 'Username or Email is already registered.' });
    }

    let dbRole = role || 'Employee';
    if (role === 'Admin') dbRole = 'Pending Admin';
    if (role === 'Compliance Officer') dbRole = 'Pending Compliance Officer';

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await DB.User.create({
      username,
      email,
      password: hashedPassword,
      role: dbRole,
      xp: 100,
      points: 200
    });

    await logAction(username, newUser.role, 'User Registered', `Account created successfully.`);
    
    res.json({
      success: true,
      user: { username: newUser.username, email: newUser.email, role: newUser.role, xp: newUser.xp, points: newUser.points }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { loginInput, password } = req.body;
  if (!loginInput || !password) {
    return res.status(400).json({ error: 'Please fill in all inputs.' });
  }

  try {
    let user;
    if (DATABASE_TYPE === 'mongodb') {
      user = await MongoUser.findOne({
        $or: [ { username: loginInput }, { email: loginInput } ]
      });
    } else {
      user = await User.findOne({
        where: sequelize.or({ username: loginInput }, { email: loginInput })
      });
    }

    if (!user) {
      return res.status(400).json({ error: 'Account does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    if (user.role && user.role.startsWith('Pending')) {
      return res.status(403).json({ error: `Your role request (${user.role}) is pending active Administrator approval.` });
    }

    await logAction(user.username, user.role, 'User Logged In', `Session authenticated.`);
    
    res.json({
      success: true,
      user: { username: user.username, email: user.email, role: user.role, xp: user.xp, points: user.points }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PROFILE ENDPOINTS ----------------

app.post('/api/profile/update', requireAuth, async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email) {
      req.auth.user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.auth.user.password = hashedPassword;
    }
    await req.auth.user.save();
    await logAction(req.auth.user.username, req.auth.role, 'Profile Updated', 'Security credentials modified.');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Switch role session
app.post('/api/profile/switch', requireAuth, async (req, res) => {
  const { role } = req.body;
  try {
    req.auth.user.role = role;
    await req.auth.user.save();
    await logAction(req.auth.user.username, role, 'Session Role Toggled', `Role changed to ${role}`);
    res.json({ success: true, profile: req.auth.user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------- ADMIN ENDPOINTS ----------------

app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await DB.User.findAll();
    const cleanUsers = users.map(u => ({
      username: u.username,
      email: u.email,
      role: u.role,
      xp: u.xp,
      points: u.points
    }));
    res.json({ users: cleanUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/update-role', requireAuth, requireAdmin, async (req, res) => {
  const { targetUser, targetRole } = req.body;
  try {
    const u = await DB.User.findOne({ username: targetUser });
    if (!u) return res.status(404).json({ error: 'User not found.' });

    u.role = targetRole;
    await u.save();

    await logAction(req.auth.user.username, req.auth.role, 'User Role Modified', `Adjusted ${targetUser} permissions to ${targetRole}.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/delete', requireAuth, requireAdmin, async (req, res) => {
  const { targetUser } = req.body;
  try {
    await DB.User.destroy({ username: targetUser });
    await logAction(req.auth.user.username, req.auth.role, 'User Registry Removed', `Deleted user account ${targetUser}.`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments/create', requireAuth, requireAdmin, async (req, res) => {
  const deptData = req.body;
  try {
    const exists = await DB.Department.findOne({ id: deptData.id });
    if (exists) return res.status(400).json({ error: 'Department already exists.' });

    await DB.Department.create(deptData);
    await logAction(req.auth.user.username, req.auth.role, 'Department Added', `Registered division '${deptData.name}' (${deptData.code}).`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CORE REST API ENDPOINTS ----------------

app.get('/api/data', requireAuth, async (req, res) => {
  try {
    const depts = await DB.Department.findAll();
    const factors = await DB.EmissionFactor.findAll();
    const carbonTx = await DB.CarbonTransaction.findAll({ order: [['createdAt', 'DESC']] });
    const csrAct = await DB.CsrActivity.findAll({ order: [['createdAt', 'DESC']] });
    const challenges = await DB.Challenge.findAll();
    const compliance = await DB.ComplianceIssue.findAll({ order: [['createdAt', 'DESC']] });
    const policies = await DB.PolicyAcknowledgement.findAll();
    const audits = await DB.AuditLog.findAll({ order: [['timestamp', 'DESC']] });

    const dbData = {
      departments: depts,
      emissionFactors: factors,
      carbonTransactions: carbonTx,
      csrActivities: csrAct,
      challenges,
      complianceIssues: compliance,
      policyAcknowledgements: policies,
      auditLogs: audits,
      badges: [
        { id: 'b-1', name: 'Carbon Buster', description: 'Log first emission reduction transaction', icon: 'Leaf', unlocked: true, unlockRuleType: 'XP', xpRequirement: 100 },
        { id: 'b-2', name: 'Social Pioneer', description: 'Participate in 3 or more approved CSR activities', icon: 'Users', unlocked: req.auth.user.xp >= 300, unlockRuleType: 'CSR Participations', unlockRuleValue: 3 },
        { id: 'b-3', name: 'Compliance Guard', description: 'Sign 3 regulatory policies', icon: 'ShieldAlert', unlocked: req.auth.user.xp >= 400, unlockRuleType: 'Policies Signed', unlockRuleValue: 3 },
        { id: 'b-4', name: 'Eco Champion', description: 'Complete 5 sustainability challenges', icon: 'Trophy', unlocked: req.auth.user.xp >= 500, unlockRuleType: 'Challenges Completed', unlockRuleValue: 5 }
      ],
      rewards: [
        { id: 'r-1', title: 'Eco-Friendly Cork Water Bottle', pointsCost: 200, stockAvailable: 15, category: 'Lifestyle', imagePlaceholder: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80' },
        { id: 'r-2', title: 'Solar Powered Phone Charger', pointsCost: 650, stockAvailable: 8, category: 'Electronics', imagePlaceholder: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=300&q=80' },
        { id: 'r-3', title: 'Plant 10 Trees Certificate', pointsCost: 150, stockAvailable: 99, category: 'Offset', imagePlaceholder: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80' },
        { id: 'r-4', title: 'Organic Canvas Tote Bag', pointsCost: 100, stockAvailable: 2, category: 'Lifestyle', imagePlaceholder: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80' }
      ],
      databaseDriver: DATABASE_TYPE
    };

    res.json({
      db: dbData,
      profile: {
        username: req.auth.user.username,
        role: req.auth.user.role,
        xp: req.auth.user.xp,
        points: req.auth.user.points
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log Carbon Emission (Requires Manager or logs pending offset for Employees)
app.post('/api/emissions', requireAuth, async (req, res) => {
  const txData = req.body;
  try {
    // Audit & Anti-cheat rules:
    if (req.auth.role === 'Employee') {
      // Employees must only log offsets (negative values) and they must be PENDING review
      if (txData.calculatedCo2 >= 0) {
        return res.status(403).json({ error: 'Access Denied: Employees can only submit green offset reductions, not operational emissions.' });
      }
      
      // Enforce rate limiting: maximum of 3 submissions per day to prevent spam
      const today = new Date().toISOString().slice(0, 10);
      const allTx = await DB.CarbonTransaction.findAll();
      const userTodayCount = allTx.filter(t => t.submittedBy === req.auth.user.username && t.date === today).length;
      if (userTodayCount >= 3) {
        return res.status(429).json({ error: 'Daily contribution limit reached (max 3 actions per day) to prevent database gaming.' });
      }

      // Enforce mandatory proof description
      if (!txData.proofDescription || txData.proofDescription.trim().length < 10) {
        return res.status(400).json({ error: 'Please enter a clear proof description (minimum 10 characters).' });
      }

      txData.status = 'Pending';
      txData.submittedBy = req.auth.user.username;
    } else {
      // Managers, Compliance Officers, and Admins can log approved transactions
      txData.status = 'Approved';
      txData.submittedBy = req.auth.user.username;
    }

    await DB.CarbonTransaction.create(txData);

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Log Carbon Transaction',
      `Submitted ${txData.sourceRef} (Value: ${txData.calculatedCo2} kg CO2, Status: ${txData.status})`
    );

    if (txData.status === 'Approved') {
      await serverRecalculateEsg();
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Pending Employee Offset contribution (Requires Manager/Admin)
app.post('/api/emissions/approve', requireAuth, requireManager, async (req, res) => {
  const { txId } = req.body;
  try {
    const tx = await DB.CarbonTransaction.findByPk(txId);
    if (!tx) return res.status(404).json({ error: 'Carbon offset contribution not found.' });

    if (tx.status === 'Approved') {
      return res.status(400).json({ error: 'This transaction is already approved.' });
    }

    tx.status = 'Approved';
    await tx.save();

    // Award XP and points to the submitter
    const submitter = await DB.User.findOne({ username: tx.submittedBy });
    if (submitter) {
      submitter.points += 15;
      submitter.xp += 15;
      await submitter.save();
    }

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Offset Approved',
      `Verified green contribution by ${tx.submittedBy}: logged ${tx.calculatedCo2} kg offset.`
    );

    await serverRecalculateEsg();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject Pending Employee Offset contribution (Requires Manager/Admin)
app.post('/api/emissions/reject', requireAuth, requireManager, async (req, res) => {
  const { txId } = req.body;
  try {
    const tx = await DB.CarbonTransaction.findByPk(txId);
    if (!tx) return res.status(404).json({ error: 'Carbon offset contribution not found.' });

    if (tx.status === 'Approved') {
      return res.status(400).json({ error: 'Cannot reject an already approved transaction.' });
    }

    tx.status = 'Rejected';
    await tx.save();

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Offset Rejected',
      `Rejected green contribution by ${tx.submittedBy}. No points credited.`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Propose CSR activity
app.post('/api/csr/propose', requireAuth, async (req, res) => {
  const actData = req.body;
  try {
    // Audits and validation rules
    if (!actData.title || actData.title.trim().length < 5) {
      return res.status(400).json({ error: 'Please enter a valid activity title.' });
    }

    // Convert participants array to comma-separated string if needed
    if (Array.isArray(actData.participants)) {
      actData.participants = actData.participants.join(',');
    }

    await DB.CsrActivity.create(actData);
    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'CSR Proposed',
      `Proposed activity '${actData.title}' worth ${actData.xpValue} XP.`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload proof/evidence for CSR activity
app.post('/api/csr/evidence', requireAuth, async (req, res) => {
  const { activityId, fileName } = req.body;
  try {
    const act = await DB.CsrActivity.findByPk(activityId);
    if (!act) return res.status(404).json({ error: 'CSR activity not found.' });

    act.evidenceFileAttached = true;
    act.evidenceFileName = fileName;
    await act.save();

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'CSR Evidence Uploaded',
      `Uploaded proof file '${fileName}' for CSR activity '${act.title}'`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join CSR activity
app.post('/api/csr/join', requireAuth, async (req, res) => {
  const { activityId, participant } = req.body;
  try {
    const act = await DB.CsrActivity.findByPk(activityId);
    if (!act) return res.status(404).json({ error: 'CSR activity not found.' });

    let currentParticipants = act.participants ? act.participants.split(',') : [];
    if (!currentParticipants.includes(participant)) {
      currentParticipants.push(participant);
      act.participants = currentParticipants.join(',');
      await act.save();
    }

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Join CSR Activity',
      `User ${participant} joined activity '${act.title}'`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve CSR activity (Requires Manager role)
app.post('/api/csr/approve', requireAuth, requireManager, async (req, res) => {
  const { activityId } = req.body;
  try {
    const act = await DB.CsrActivity.findByPk(activityId);
    if (!act) return res.status(404).json({ error: 'CSR activity not found.' });

    act.status = 'Approved';
    await act.save();

    // Award XP/Points to all participants
    const participantList = act.participants ? act.participants.split(',') : [];
    for (const username of participantList) {
      const pUser = await DB.User.findOne({ username });
      if (pUser) {
        pUser.xp += act.xpValue;
        pUser.points += act.pointsValue;
        await pUser.save();
      }
    }

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'CSR Approved',
      `Approved activity '${act.title}'. Awarded +${act.xpValue} XP to participants.`
    );

    await serverRecalculateEsg();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report compliance issue
app.post('/api/compliance', requireAuth, async (req, res) => {
  const issueData = req.body;
  try {
    await DB.ComplianceIssue.create(issueData);
    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Compliance Logged',
      `Reported violation '${issueData.title}' allocated to ${issueData.owner}.`
    );
    await serverRecalculateEsg();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve compliance issue (Requires Manager role)
app.post('/api/compliance/resolve', requireAuth, requireManager, async (req, res) => {
  const { issueId } = req.body;
  try {
    const issue = await DB.ComplianceIssue.findByPk(issueId);
    if (!issue) return res.status(404).json({ error: 'Compliance issue not found.' });

    issue.status = 'Resolved';
    await issue.save();

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Compliance Resolved',
      `Resolved issue '${issue.title}'`
    );

    await serverRecalculateEsg();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign policy
app.post('/api/policy/sign', requireAuth, async (req, res) => {
  const { policyId, employee } = req.body;
  try {
    const pol = await DB.PolicyAcknowledgement.findByPk(policyId);
    if (!pol) return res.status(404).json({ error: 'Policy charter not found.' });

    let signers = pol.acknowledgedEmployees ? pol.acknowledgedEmployees.split(',') : [];
    if (!signers.includes(employee)) {
      signers.push(employee);
      pol.acknowledgedEmployees = signers.join(',');
      pol.acknowledgedCount += 1;
      await pol.save();

      // Signatory bonus
      req.auth.user.xp += 50;
      req.auth.user.points += 50;
      await req.auth.user.save();
    }

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Policy Signed',
      `Signed policy: '${pol.policyName}' by ${employee}`
    );

    await serverRecalculateEsg();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redeem reward
app.post('/api/rewards/redeem', requireAuth, async (req, res) => {
  const { rewardId } = req.body;
  
  const rewardItems = {
    'r-1': { title: 'Eco-Friendly Cork Water Bottle', cost: 200 },
    'r-2': { title: 'Solar Powered Phone Charger', cost: 650 },
    'r-3': { title: 'Plant 10 Trees Certificate', cost: 150 },
    'r-4': { title: 'Organic Canvas Tote Bag', cost: 100 }
  };

  const item = rewardItems[rewardId];
  if (!item) return res.status(404).json({ error: 'Reward not found.' });

  if (req.auth.user.points < item.cost) {
    return res.status(400).json({ error: 'Insufficient green points balance.' });
  }

  try {
    req.auth.user.points -= item.cost;
    await req.auth.user.save();

    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'Redeem Reward',
      `Redeemed reward: '${item.title}'`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply new ESG allocation weights
app.post('/api/settings/weights', requireAuth, async (req, res) => {
  const { env, soc, gov } = req.body;
  try {
    await serverRecalculateEsg({ env, soc, gov });
    await logAction(
      req.auth.user.username,
      req.auth.user.role,
      'ESG Weights Applied',
      `Weights changed to: E(${env}%), S(${soc}%), G(${gov}%)`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`>>> EcoSphere server running on port ${PORT}`);
});
