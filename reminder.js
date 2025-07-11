const fs = require('fs');
const fetch = require('node-fetch');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config(); // Load environment variables

console.log("⏰ Birthday Reminder Service Started at:", new Date().toLocaleString());

// Configuration from environment variables
const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN || '7709475621:AAFeLuRMreKn0U4fji21OSePzCk-FzDMgT8',
  YOUR_CHAT_ID: process.env.CHAT_ID || 1213579914,
  USERNAME: process.env.USERNAME || 'User',
  BOT_API: process.env.BOT_API || 'https://api.telegram.org/bot',
  DATA_FILE: './data.json',
  TIMEZONE: 'Asia/Kolkata', // Set your timezone
  BACKUP_DIR: './backups'
};

// Validate environment variables
function validateEnvironment() {
  const requiredEnvVars = ['BOT_TOKEN', 'CHAT_ID', 'USERNAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
    console.warn('⚠️  Using default values - please set up .env file');
  } else {
    console.log('✅ All environment variables loaded successfully');
  }
  
  // Validate critical configs
  if (!CONFIG.BOT_TOKEN || CONFIG.BOT_TOKEN.length < 10) {
    console.error('❌ Invalid BOT_TOKEN');
    process.exit(1);
  }
  
  if (!CONFIG.YOUR_CHAT_ID) {
    console.error('❌ Invalid CHAT_ID');
    process.exit(1);
  }
}

// Ensure data file exists
function ensureDataFile() {
  if (!fs.existsSync(CONFIG.DATA_FILE)) {
    fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify([]));
    console.log('📝 Created new data.json file');
  }
}

// Create backup directory
function ensureBackupDir() {
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    console.log('📁 Created backup directory');
  }
}

// Backup data file
function backupData() {
  try {
    ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(CONFIG.BACKUP_DIR, `data_backup_${timestamp}.json`);
    
    if (fs.existsSync(CONFIG.DATA_FILE)) {
      fs.copyFileSync(CONFIG.DATA_FILE, backupFile);
      console.log('💾 Data backed up to:', backupFile);
    }
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Enhanced message sending with retry logic
async function sendReminder(message, retries = 3) {
  const url = `${CONFIG.BOT_API}${CONFIG.BOT_TOKEN}/sendMessage`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.YOUR_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Reminder sent successfully');
        return true;
      } else {
        throw new Error(`Telegram API error: ${data.description}`);
      }
    } catch (error) {
      console.error(`❌ Send attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }
  
  console.error('❌ All send attempts failed');
  return false;
}

// DEBUG FUNCTION - Add this to check what's happening
function debugBirthdays() {
  try {
    console.log('\n🔍 DEBUG: Checking birthday data...');
    
    const rawData = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
    console.log('📄 Raw data from file:', rawData);
    
    const data = JSON.parse(rawData);
    console.log('📊 Parsed data:', data);
    console.log('📊 Data length:', data.length);
    
    // Check tomorrow's date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const checkDateMMDD = `${mm}-${dd}`;
    const checkDateDDMM = `${dd}-${mm}`;
    
    console.log(`🗓️  Tomorrow's date: ${targetDate.toDateString()}`);
    console.log(`🔍 Looking for: ${checkDateMMDD} (MM-DD) or ${checkDateDDMM} (DD-MM)`);
    
    // Check each entry
    data.forEach((entry, index) => {
      console.log(`\n👤 Entry ${index + 1}:`);
      console.log(`   Name: "${entry.name}"`);
      console.log(`   Date: "${entry.date}"`);
      console.log(`   Gender: "${entry.gender}"`);
      console.log(`   Matches MM-DD: ${entry.date === checkDateMMDD}`);
      console.log(`   Matches DD-MM: ${entry.date === checkDateDDMM}`);
    });
    
    const birthdays = data.filter(entry => {
      if (!entry.date || !entry.name) {
        console.log(`❌ Invalid entry: ${JSON.stringify(entry)}`);
        return false;
      }
      return entry.date === checkDateMMDD || entry.date === checkDateDDMM;
    });
    
    console.log(`\n🎯 Found birthdays:`, birthdays);
    
    if (birthdays.length > 0) {
      const message = generateBirthdayMessage(birthdays, 1);
      console.log(`\n💬 Generated message:`, message);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

// Enhanced birthday checking with better date handling
function checkBirthdays(daysAhead = 1) {
  try {
    ensureDataFile();
    
    const rawData = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!Array.isArray(data)) {
      console.error('❌ Invalid data format in data.json');
      return [];
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    // Handle both MM-DD and DD-MM formats
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const checkDateMMDD = `${mm}-${dd}`;
    const checkDateDDMM = `${dd}-${mm}`;

    console.log(`🔍 Checking for birthdays on: ${checkDateMMDD} (MM-DD) or ${checkDateDDMM} (DD-MM)`);

    const birthdays = data.filter(entry => {
      if (!entry.date || !entry.name) return false;
      return entry.date === checkDateMMDD || entry.date === checkDateDDMM;
    });

    console.log(`📋 Found ${birthdays.length} birthday(s)`);
    
    // DEBUG: Show found birthdays
    if (birthdays.length > 0) {
      console.log('🎯 Found these birthdays:');
      birthdays.forEach((birthday, index) => {
        console.log(`   ${index + 1}. ${birthday.name} (${birthday.date})`);
      });
    }
    
    return birthdays;

  } catch (error) {
    console.error('❌ Error checking birthdays:', error.message);
    return [];
  }
}

// Generate personalized birthday message
function generateBirthdayMessage(birthdays, daysAhead = 1) {
  if (birthdays.length === 0) return null;

  const timeWord = daysAhead === 0 ? 'Today' : daysAhead === 1 ? 'Tomorrow' : `In ${daysAhead} days`;
  const isWord = daysAhead === 0 ? 'is' : 'will be';
  
  let message = `🎉 *Birthday Reminder for ${CONFIG.USERNAME}* 🎉\n\n`;
  
  birthdays.forEach((person, index) => {
    const gender = person.gender?.toLowerCase();
    const emoji = gender === 'female' ? '👸' : gender === 'male' ? '🤴' : '🎂';
    const pronouns = gender === 'female' ? 'her' : gender === 'male' ? 'his' : 'their';
    
    message += `${emoji} *${person.name}* - ${timeWord} ${isWord} ${pronouns} birthday!\n`;
  });

  if (daysAhead === 1) {
    message += `\n🕛 *Don't forget to wish at 12:00 AM sharp!*`;
  } else if (daysAhead === 0) {
    message += `\n🎁 *Time to celebrate!* 🥳`;
  }

  message += `\n\n📅 Total: ${birthdays.length} birthday${birthdays.length > 1 ? 's' : ''}`;
  
  return message;
}

// Log system status
function logStatus() {
  console.log('\n📊 === Birthday Reminder Status ===');
  console.log(`⏰ Current time: ${new Date().toLocaleString()}`);
  console.log(`👤 Username: ${CONFIG.USERNAME}`);
  console.log(`📁 Data file: ${CONFIG.DATA_FILE}`);
  console.log(`🤖 Bot token: ${CONFIG.BOT_TOKEN.substring(0, 10)}...`);
  console.log(`👤 Your chat ID: ${CONFIG.YOUR_CHAT_ID}`);
  console.log(`🌐 Bot API: ${CONFIG.BOT_API}`);
  
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf8'));
    console.log(`📋 Total birthdays in database: ${data.length}`);
  } catch (error) {
    console.log('❌ Could not read data file');
  }
  
  console.log('================================\n');
}

// Main reminder function
async function runBirthdayCheck() {
  console.log('\n🔄 Running birthday check...');
  
  const birthdays = checkBirthdays(1); // Check tomorrow's birthdays
  const message = generateBirthdayMessage(birthdays, 1);
  
  if (message) {
    console.log('💬 Message to send:', message);
    const success = await sendReminder(message);
    if (success) {
      console.log('✅ Birthday reminder sent successfully!');
    } else {
      console.log('❌ Failed to send birthday reminder');
    }
  } else {
    console.log('📭 No birthdays tomorrow - no reminder needed');
  }
  
  console.log('🔄 Birthday check completed\n');
}

// Today's birthday check (separate function)
async function checkTodaysBirthdays() {
  console.log('\n🎂 Checking today\'s birthdays...');
  
  const birthdays = checkBirthdays(0); // Check today's birthdays
  const message = generateBirthdayMessage(birthdays, 0);
  
  if (message) {
    console.log('💬 Message to send:', message);
    const success = await sendReminder(message);
    if (success) {
      console.log('✅ Today\'s birthday reminder sent!');
    }
  } else {
    console.log('📭 No birthdays today');
  }
}

// Initialize the service
function initialize() {
  console.log('🚀 Initializing Birthday Reminder Service...');
  
  validateEnvironment();
  ensureDataFile();
  ensureBackupDir();
  logStatus();
  
  console.log('✅ Service initialized successfully!');
}

// === CRON JOBS ===

// Daily reminder at 11:50 PM (23:50)
cron.schedule('50 23 * * *', async () => {
  console.log('⏰ Daily reminder job triggered at:', new Date().toLocaleString());
  await runBirthdayCheck();
}, {
  scheduled: true,
  timezone: CONFIG.TIMEZONE
});

// Today's birthday check at 12:01 AM (00:01)
cron.schedule('1 0 * * *', async () => {
  console.log('🎂 Today\'s birthday check triggered at:', new Date().toLocaleString());
  await checkTodaysBirthdays();
}, {
  scheduled: true,
  timezone: CONFIG.TIMEZONE
});

// Weekly backup every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', () => {
  console.log('💾 Weekly backup triggered at:', new Date().toLocaleString());
  backupData();
}, {
  scheduled: true,
  timezone: CONFIG.TIMEZONE
});

// Status log every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('📊 Status check triggered at:', new Date().toLocaleString());
  logStatus();
}, {
  scheduled: true,
  timezone: CONFIG.TIMEZONE
});

// === ERROR HANDLING ===

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.log('🔄 Service will continue running...');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Service will continue running...');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Birthday Reminder Service...');
  console.log('💾 Creating final backup...');
  backupData();
  console.log('✅ Service stopped gracefully');
  process.exit(0);
});

// === ADDITIONAL FEATURES ===

// Manual test function (can be called from command line)
async function testReminder() {
  console.log('🧪 Testing reminder system...');
  
  const testMessage = `🧪 *Test Reminder for ${CONFIG.USERNAME}*\n\nThis is a test message from your Birthday Reminder Service.\n\n⏰ Sent at: ${new Date().toLocaleString()}\n🤖 Bot API: ${CONFIG.BOT_API}`;
  
  const success = await sendReminder(testMessage);
  if (success) {
    console.log('✅ Test reminder sent successfully!');
  } else {
    console.log('❌ Test reminder failed');
  }
}

// Export functions for external use
module.exports = {
  sendReminder,
  checkBirthdays,
  generateBirthdayMessage,
  testReminder,
  backupData,
  debugBirthdays  // Export the debug function
};

// Initialize the service
initialize();

// If script is run with 'test' argument, send test message
if (process.argv.includes('test')) {
  testReminder();
}

// If script is run with 'debug' argument, run debug function
if (process.argv.includes('debug')) {
  debugBirthdays();
}

console.log('Born2wishu bot is running🎂...');
console.log('📅 Next reminder check: Tomorrow at 11:50 PM');
console.log('🎉 Next birthday check: Tomorrow at 12:01 AM');
console.log('💾 Next backup: Sunday at 2:00 AM');
console.log('📊 Status updates: Every 6 hours');
console.log('\n💡 Use "node reminder.js test" to send a test message');
console.log('💡 Use "node reminder.js debug" to debug birthday data');
console.log('🛑 Press Ctrl+C to stop the service\n');