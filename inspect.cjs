const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  let logContent = '';
  function log(msg, obj) {
    if (obj) {
      logContent += msg + ' ' + JSON.stringify(obj, null, 2) + '\n';
    } else {
      logContent += msg + '\n';
    }
  }

  try {
    log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    log('Connected.');

    const db = mongoose.connection.db;

    // 1. Get collection validator
    log('Retrieving collection rules...');
    const collections = await db.listCollections({ name: 'csractivities' }).toArray();
    if (collections.length > 0) {
      log('Collection options:', collections[0].options);
    } else {
      log('Collection csractivities not found.');
    }

    // 2. Fetch sample documents
    log('Fetching sample activities...');
    const docs = await db.collection('csractivities').find({}).limit(5).toArray();
    log('Sample documents:', docs);

  } catch (error) {
    log('Error occurred:', error.stack || error);
  } finally {
    fs.writeFileSync('db_inspection.txt', logContent);
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
