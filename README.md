# 🎂 Birthday Reminder Bot

A Node.js-based birthday reminder service that sends automated Telegram messages to remind you of upcoming birthdays.

## ✨ Features

- 🎉 **Automated Birthday Reminders**: Get notified at 11:50 PM about tomorrow's birthdays
- 🎂 **Today's Birthday Alerts**: Receive birthday notifications at 12:01 AM
- 💾 **Automatic Backups**: Weekly data backups every Sunday at 2:00 AM
- 📊 **Status Monitoring**: System status updates every 6 hours
- 🔄 **Retry Logic**: Robust message sending with automatic retries
- 🧪 **Test Mode**: Send test messages to verify setup
- 🔍 **Debug Mode**: Debug your birthday data and check for issues
- 👤 **Gender-Specific Emojis**: Different emojis for male (🤴), female (👸), and other (🎂)

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token
- Your Telegram Chat ID

## 🚀 Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd birthday-reminder-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install required packages**
   ```bash
   npm install node-fetch node-cron dotenv
   ```

## ⚙️ Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```env
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_chat_id_here
USERNAME=Your Name
```

### 2. Get Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token and paste it in your `.env` file

### 3. Get Your Chat ID

1. Start a conversation with your bot
2. Send any message to your bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":YOUR_CHAT_ID}` in the response
5. Copy the chat ID and paste it in your `.env` file

### 4. Setup Birthday Data

Create a `data.json` file in the root directory with your birthday data:

```json
[
  {
    "name": "John Doe",
    "date": "03-15",
    "gender": "male"
  },
  {
    "name": "Jane Smith",
    "date": "07-22",
    "gender": "female"
  },
  {
    "name": "Alex Johnson",
    "date": "12-01",
    "gender": "other"
  }
]
```

**Date Format**: Use MM-DD format (Month-Day)
- January 15th = "01-15"
- July 4th = "07-04"
- December 25th = "12-25"

**Gender Options**: "male", "female", "other" (affects emoji choice)

## 🏃 Usage

### Start the Service

```bash
node reminder.js
```

The bot will start and show:
```
⏰ Birthday Reminder Service Started at: [timestamp]
🎂 Born2wishu bot is running...
📅 Next reminder check: Tomorrow at 11:50 PM
🎉 Next birthday check: Tomorrow at 12:01 AM
💾 Next backup: Sunday at 2:00 AM
📊 Status updates: Every 6 hours
```

### Test the Bot

```bash
node reminder.js test
```

This sends a test message to verify your setup is working.

### Debug Birthday Data

```bash
node reminder.js debug
```

This shows detailed information about your birthday data and helps troubleshoot issues.

## 📅 Schedule

The bot runs on the following schedule:

| Time | Action | Description |
|------|--------|-------------|
| 11:50 PM | Tomorrow's Birthdays | Reminds you about tomorrow's birthdays |
| 12:01 AM | Today's Birthdays | Celebrates today's birthdays |
| 2:00 AM (Sunday) | Weekly Backup | Creates backup of your data |
| Every 6 hours | Status Check | Logs system status |

## 📁 File Structure

```
birthday-reminder-bot/
├── reminder.js          # Main application file
├── data.json           # Birthday data (you create this)
├── .env               # Environment variables (you create this)
├── package.json       # npm dependencies
├── backups/           # Automatic backups folder
└── README.md          # This file
```

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid BOT_TOKEN" Error**
   - Check your `.env` file has the correct bot token
   - Ensure no extra spaces in the token

2. **"Invalid CHAT_ID" Error**
   - Verify your chat ID is correct
   - Make sure you've started a conversation with your bot

3. **No Birthday Reminders**
   - Check your `data.json` format
   - Use `node reminder.js debug` to see what's happening
   - Ensure dates are in MM-DD format

4. **Bot Not Responding**
   - Test with `node reminder.js test`
   - Check your internet connection
   - Verify bot token is active

### Debug Information

Run debug mode to see detailed information:
```bash
node reminder.js debug
```

This will show:
- Raw data from your file
- Date format checking
- Tomorrow's date calculations
- Found birthday matches
- Generated messages

## 🎯 Message Examples

### Tomorrow's Birthday Reminder (11:50 PM)
```
🎉 Birthday Reminder for Your Name 🎉

🤴 John Doe - Tomorrow will be his birthday!
👸 Jane Smith - Tomorrow will be her birthday!

🕛 Don't forget to wish at 12:00 AM sharp!

📅 Total: 2 birthdays
```

### Today's Birthday Alert (12:01 AM)
```
🎉 Birthday Reminder for Your Name 🎉

🤴 John Doe - Today is his birthday!
👸 Jane Smith - Today is her birthday!

🎁 Time to celebrate! 🥳

📅 Total: 2 birthdays
```

## 🛡️ Security Features

- Environment variables for sensitive data
- Automatic backup system
- Error handling and retry logic
- Graceful shutdown handling
- Input validation

## 🔄 Backup System

- Automatic weekly backups every Sunday at 2:00 AM
- Backups stored in `./backups/` folder
- Backup files named with timestamps
- Manual backup on graceful shutdown

## 📞 Support

If you encounter any issues:

1. Run debug mode: `node reminder.js debug`
2. Check your `.env` file configuration
3. Verify your `data.json` format
4. Test with: `node reminder.js test`

## 🎨 Customization

You can customize:
- **Timezone**: Change `TIMEZONE` in the config
- **Schedule**: Modify cron expressions
- **Messages**: Edit the `generateBirthdayMessage` function
- **Emojis**: Update gender-specific emojis
- **Retry Logic**: Adjust retry attempts and delays

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Node.js and node-cron
- Uses Telegram Bot API
- Supports multiple date formats for flexibility

## 🚧 Development Status

**Current Version**: v1.0 (Telegram Support)

### 🔄 Active Development
This project is actively being developed with exciting new features coming soon!

### 🎯 Upcoming Features
- 📱 **WhatsApp Integration** - Send birthday reminders via WhatsApp (In Development)
- 🔄 **Multi-Platform Support** - Choose between Telegram, WhatsApp, or both
- 📧 **Email Notifications** - Additional reminder channel option
- 🎨 **Custom Message Templates** - Personalized birthday messages
- 🌐 **Web Dashboard** - Manage birthdays through a web interface
- 📊 **Analytics** - Track reminder success rates and engagement
- 🔐 **Enhanced Security** - Advanced encryption for sensitive data

### 🛠️ WhatsApp Integration Progress
Currently working on integrating WhatsApp Web API to expand notification channels. This will allow users to:
- Send birthday reminders via WhatsApp
- Choose preferred notification platform
- Receive reminders on multiple platforms simultaneously
- Enjoy the same reliable scheduling with WhatsApp's familiar interface

### 🤝 Contributing
We welcome contributions! If you'd like to help with:
- WhatsApp integration development
- Bug fixes and improvements
- Feature suggestions
- Documentation updates

Please feel free to submit issues or pull requests.

### 📬 Stay Updated
Watch this repository for updates on WhatsApp integration and other exciting features!

---

**Happy Birthday Reminding! 🎉**

*Made with ❤️ for never forgetting special moments*
