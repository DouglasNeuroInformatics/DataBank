// @ts-check

import readline from 'readline/promises';

import { MongoClient } from 'mongodb';

const TP_ANSI_RESET = '\x1b[0m';

const TP_ANSI_BOLD_ON = '\x1b[1m';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dbName = process.env.NODE_ENV === 'production' ? 'production' : 'development';

await confirmRun();

const client = new MongoClient(parseEnv('MONGO_URI'));
await client.connect();

const db = client.db(dbName);
await db.dropDatabase();

await createAdmin();

//console.log(await users.find().toArray());

client.close();
rl.close();

/** Confirm the user wants to run the script, which includes deleting the database */
async function confirmRun() {
  console.clear();
  console.log(
    [
      'This script will perform the following tasks to bootstrap a databank instance',
      '1. Create an admin user',
      TP_ANSI_BOLD_ON + `2. Drop the database '${dbName}'` + TP_ANSI_RESET
    ].join('\n') + '\n'
  );

  const response = await rl.question('Please confirm you would like to continue (y/N): ');
  switch (response.toLowerCase()) {
    case 'y' || 'yes':
      console.log();
      return;
    default:
      process.exit(0);
  }
}

async function createAdmin() {
  console.log('Create Admin User');
  const defaultEmail = 'admin@example.org';
  const defaultPassword = 'password';
  const email = (await rl.question(`Email (default: ${defaultEmail}): `)) || defaultEmail;
  const password = (await rl.question(`Password (default: ${defaultPassword}): `)) || defaultPassword;
  console.log(Boolean(email));
}

// UTILITY FUNCTIONS

/**
 * Return the environment variable, or exit script if it is not defined
 * @param {string} key
 * @returns {string}
 */
function parseEnv(key) {
  const value = process.env[key];
  if (!value) {
    console.error(`ERROR: Environment variable is not defined: '${key}'`);
    process.exit(1);
  }
  return value;
}
