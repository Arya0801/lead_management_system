
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const { MONGO_URI } = require('../config/env');
const User = require('../models/User');
const Lead = require('../models/Lead');

const createTestUser = async () => {
  const email = 'testuser0@example.com';
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name: 'first user',
      email,
      password: 'password1234', // will be hashed in pre-save
    });
    await user.save();
    console.log('Created test user:', email, 'password: password1234');
  } else {
    console.log('Test user already exists:', email);
  }

  return user; 
};

const createLeads = async (userId, n = 120) => {
  const leads = [];
  for (let i = 0; i < n; i++) {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}.${i}@example.com`;
    const company = faker.company.name();
    const city = faker.location.city();
    const state = faker.location.state();
    const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
    const score = faker.number.int({ min: 0, max: 100 });
    const lead_value = Number(faker.finance.amount({ min: 100, max: 10000, dec: 2 }));
    const last_activity_at = faker.datatype.boolean() ? faker.date.recent({ days: 90 }) : null;
    const is_qualified = faker.datatype.boolean();

    leads.push({
      first_name,
      last_name,
      email,
      phone: faker.phone.number(),
      company,
      city,
      state,
      source: faker.helpers.arrayElement(sources),
      status: faker.helpers.arrayElement(statuses),
      score,
      lead_value,
      last_activity_at,
      is_qualified,
      owner: userId, 
    });
  }

  try {
    await Lead.insertMany(leads, { ordered: false });
    console.log(`Inserted ${n} leads (duplicates ignored).`);
  } catch (err) {
    console.log('InsertMany finished with potential duplicates ignored.');
  }
};

const run = async () => {
  try {
    await connectDB(MONGO_URI);
    const user = await createTestUser(); 
    await createLeads(user._id, 120);
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
};

if (require.main === module) run();
