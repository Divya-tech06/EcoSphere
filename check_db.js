const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const db = mongoose.connection.db;

    // 1. Get collection validation rules
    console.log('Retrieving collection validation rules...');
    const collections = await db.listCollections({ name: 'csractivities' }).toArray();
    if (collections.length > 0) {
      console.log('Validator Rules:', JSON.stringify(collections[0].options?.validator, null, 2));
    } else {
      console.log('Collection csractivities not found.');
    }

    // 2. Fetch a few documents
    console.log('Fetching sample CSR activities...');
    const docs = await db.collection('csractivities').find({}).limit(5).toArray();
    console.log('Documents sample:', JSON.stringify(docs, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
