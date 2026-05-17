# Acadify - AI Learning Management System

An intelligent, AI-powered learning management system designed to enhance student education through personalized learning experiences, interactive tutoring, and progress tracking.

## 🎯 Features

- **AI Tutor**: Get real-time assistance from an AI-powered tutor powered by Groq's LLaMA 3.3 model
- **Quiz Generator**: Automatically generate quizzes based on your course materials
- **Progress Tracker**: Monitor your learning progress and achievements over time
- **Personalized Review**: Receive customized review sessions tailored to your learning needs
- **Student Portal**: Secure login and registration system for students
- **Responsive Design**: Beautiful, modern UI that works on desktop and mobile devices

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Groq API Key** (free tier available at [Groq Console](https://console.groq.com))

## 🚀 Quick Start

### 1. Clone or Download the Project
```bash
cd "c:\AI Learning Management Website\ailms"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:
```bash
GROQ_KEY=your_groq_api_key_here
```

Replace `your_groq_api_key_here` with your actual Groq API key from [console.groq.com](https://console.groq.com).

### 4. Start the Server
```bash
node server.js
```

The application will be available at `http://localhost:3000`

### 5. Login with Demo Account
- **Email**: `demo@acadify.edu`
- **Password**: `password123`

## 📁 Project Structure

```
ailms/
├── index.html          # Main HTML file with UI layout
├── mainscript.js       # Core JavaScript functionality (auth, storage, navigation)
├── server.js           # Node.js server and API endpoints
├── style.css           # Styling and responsive design
├── package.json        # Project dependencies
├── .env                # Environment variables (create this file)
└── README.md           # This file
```

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with built-in `http` module
- **AI Engine**: Groq API (LLaMA 3.3 70B)
- **Storage**: Browser localStorage for user data and session management
- **Icons**: Font Awesome 6.5.0

## 📊 Key Functionality

### Authentication System
- User registration with email, student ID, and grade level
- Secure login with password validation
- Password strength indicator
- Demo account for testing

### User Management
- Session management using localStorage
- User profile information storage
- Per-user data isolation

### AI Integration
- `/api/ai` endpoint for AI requests
- Real-time responses from Groq's LLaMA model
- Error handling and validation
- Support for complex queries

### Dashboard
- Welcome greeting
- Quick access to all features
- Navigation between different sections

## � Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_KEY` | Your Groq API authentication key | Yes |

## 🌐 API Endpoints

### POST `/api/ai`
Send a prompt to the AI tutor and receive a response.

**Request:**
```json
{
  "prompt": "Explain the theory of relativity"
}
```

**Response:**
```json
{
  "content": [
    {
      "text": "The theory of relativity..."
    }
  ]
}
```

## 🔐 Security Notes

- Passwords are stored in localStorage (for demo purposes)
- Never commit your `.env` file with real API keys
- Use HTTPS in production
- Implement proper backend authentication for production use

## 🎨 Customization

### Modify Colors and Styling
Edit `style.css` to change colors, fonts, and layout

### Change Application Name
Replace "Acadify" throughout the files with your preferred name

### Add New Features
Extend `mainscript.js` and `index.html` to add new pages and functionality

## 🐛 Troubleshooting

### "No API key" Error
- Ensure you've created a `.env` file with your Groq API key
- Verify the key is valid at [console.groq.com](https://console.groq.com)

### Port Already in Use
- Change the PORT in `server.js` from 3000 to another available port

### CORS Issues
- The server already has CORS headers configured
- If issues persist, ensure you're accessing from `http://localhost:3000`

## � Demo Credentials

**Pre-loaded Demo Account:**
- Email: `demo@acadify.edu`
- Student ID: `2024-00001`
- Password: `password123`
- Grade: 3rd Year College

## 🚀 Production Deployment

Before deploying to production:

1. Implement a proper backend database (MongoDB, PostgreSQL, etc.)
2. Use secure session management (JWT, sessions with secure cookies)
3. Enable HTTPS/SSL
4. Implement proper authentication and authorization
5. Add rate limiting to API endpoints
6. Sanitize all user inputs
7. Environment-specific configurations

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Happy Learning with Acadify! 🎓✨**
