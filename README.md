# 🎵 Spectron

<div align="center">

![Spectron Logo](https://cdn.discordapp.com/app-icons/775370551840997376/48a35509e8badcfe710ffc92fe6db8ce.png?size=128)

**A feature-rich Discord music bot built with TypeScript and Discord.js**

[![Discord.js](https://img.shields.io/badge/Discord.js-Latest-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub last commit](https://img.shields.io/github/last-commit/VanXodus305/Spectron?style=for-the-badge)](https://github.com/VanXodus305/Spectron/commits/main)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

### 🚀 Quick Links

<div align="center">

[![Invite Bot](https://img.shields.io/badge/Invite%20Bot-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=775370551840997376&permissions=279214115840&scope=bot%20applications.commands)
[![Check Status](https://img.shields.io/badge/Check%20Status-00D26A?style=for-the-badge&logo=statuspage&logoColor=white)](https://spectron-vanxodus305.koyeb.app)

</div>

</div>

## ✨ Features

### 🎶 **Music Playback**

- **High-quality audio streaming** with Discord.js voice
- **Search and play** music from multiple sources
- **Spotify integration** - Play tracks and playlists directly from Spotify URLs
- **Interactive search** - Select from multiple search results
- **Progress tracking** with visual progress bars

### 🎛️ **Playback Controls**

- ⏯️ **Play/Pause** - Full playback control
- ⏭️ **Skip** - Skip current track
- ⏹️ **Stop** - Stop playback and clear queue
- ▶️ **Resume** - Resume paused tracks
- 🔁 **Loop** - Loop individual tracks or entire queue
- 🔀 **Shuffle** - Randomize queue order

### 📋 **Queue Management**

- 📄 **View Queue** - Interactive paginated queue display
- 🗑️ **Clear Queue** - Remove all or specific tracks
- 🎶 **Autoplay** - Automatically play recommended tracks when queue ends
- 📊 **Queue Status** - Real-time queue updates

### 🎧 **Voice Channel Features**

- ⏏️ **Smart Join** - Automatically join voice channels
- 👋 **Auto Disconnect** - Leave when no users present
- 🎭 **Stage Channel Support** - Full compatibility with Discord stage channels
- 🔊 **Permission Handling** - Intelligent permission checking

### ℹ️ **Information & Utilities**

- 📊 **Now Playing** - Rich embed with track information and progress
- 🏓 **Ping Command** - Bot latency and uptime information
- 📚 **Help System** - Comprehensive command listing
- 🎯 **Real-time Status** - Dynamic bot status updates

## 🚀 Quick Start

### Prerequisites

- Node.js 16.9.0 or higher
- Discord Bot Token
- MongoDB URI (optional, for advanced features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/VanXodus305/Spectron.git
   cd Spectron
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   Discord_Token=your_discord_bot_token
   MongoDB_URI=your_mongodb_connection_string
   Song_API_URL=your_music_api_url
   Spotify_Client_ID=your_spotify_client_id
   Spotify_Client_Secret=your_spotify_client_secret
   ```

4. **Start the bot**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## 📖 Commands

### 🎵 Music Commands

| Command       | Description                              | Usage                   |
| ------------- | ---------------------------------------- | ----------------------- |
| `/play`       | Search and play music in a voice channel | `/play query:song name` |
| `/pause`      | Pause the currently playing track        | `/pause`                |
| `/resume`     | Resume the paused track                  | `/resume`               |
| `/skip`       | Skip the current track                   | `/skip`                 |
| `/stop`       | Stop playback and clear queue            | `/stop`                 |
| `/nowplaying` | Show current track information           | `/nowplaying`           |
| `/join`       | Join your voice channel                  | `/join`                 |
| `/leave`      | Leave the voice channel                  | `/leave`                |

### 🎛️ Advanced Controls

| Command       | Description               | Usage                           |
| ------------- | ------------------------- | ------------------------------- |
| `/loop track` | Loop the current track    | `/loop track choice:true/false` |
| `/loop queue` | Loop the entire queue     | `/loop queue choice:true/false` |
| `/shuffle`    | Shuffle the current queue | `/shuffle`                      |
| `/autoplay`   | Enable/disable autoplay   | `/autoplay choice:true/false`   |

### 📋 Queue Management

| Command        | Description            | Usage                         |
| -------------- | ---------------------- | ----------------------------- |
| `/queue view`  | View the current queue | `/queue view`                 |
| `/queue clear` | Clear the entire queue | `/queue clear`                |
| `/queue clear` | Remove specific track  | `/queue clear track:position` |

### ℹ️ Information

| Command | Description                 | Usage   |
| ------- | --------------------------- | ------- |
| `/help` | List all available commands | `/help` |
| `/ping` | Show bot latency and uptime | `/ping` |

## 🛠️ Technical Features

### 🏗️ **Architecture**

- **TypeScript** for type safety and better development experience
- **WOKCommands** for advanced command handling
- **Modular design** with separate features and utilities
- **Event-driven architecture** for responsive interactions

### 🎵 **Audio Engine**

- **@discordjs/voice** for high-quality audio streaming
- **FFmpeg** for audio processing
- **Smart buffering** for smooth playback
- **Error recovery** and connection stability

### 🔧 **Advanced Features**

- **Spotify API integration** for playlist and track resolution
- **Progress tracking** with visual progress bars
- **Interactive components** with buttons and select menus
- **Auto-disconnect** when voice channel is empty
- **Permission validation** for voice channels

### 📊 **Performance**

- **Efficient queue management** with Collection-based storage
- **Memory optimization** for large playlists
- **Graceful error handling** throughout the application
- **Connection pooling** for database operations

## 🔧 Configuration

### Environment Variables

| Variable                | Description                       | Required |
| ----------------------- | --------------------------------- | -------- |
| `Discord_Token`         | Your Discord bot token            | ✅       |
| `MongoDB_URI`           | MongoDB connection string         | ❌       |
| `Song_API_URL`          | Music API endpoint                | ✅       |
| `Spotify_Client_ID`     | Spotify application client ID     | ✅       |
| `Spotify_Client_Secret` | Spotify application client secret | ✅       |

### Bot Permissions

Ensure your bot has the following permissions:

- Send Messages
- Use Slash Commands
- Connect (to voice channels)
- Speak (in voice channels)
- Use Voice Activity
- Request to Speak (for stage channels)
- Mute Members (for stage channels)

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Production Deployment

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting
- Add appropriate error handling
- Update documentation for new features

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check the [existing issues](https://github.com/VanXodus305/Spectron/issues)
2. Create a new issue with detailed information
3. Include logs and error messages when applicable

## 📋 Planned Features

- [ ] Personal playlist management
- [ ] Advanced queue manipulation (remove specific positions)
- [ ] Interactive buttons for player controls
- [ ] Volume control per server
- [ ] Music filters and effects
- [ ] Last.fm integration
- [ ] Multi-language support

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord.js** community for excellent documentation
- **WOKCommands** for the command framework
- **Spotify** for their comprehensive API
- All contributors and users of Spectron

---

<div align="center">

**Made with ❤️ by [VanXodus305](https://github.com/VanXodus305)**

[⬆ Back to Top](#-spectron)

</div>
