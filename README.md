# MindMosaic

A comprehensive mental wellness application designed to provide personalized resources, AI chat support, community connections, and informative content for mental health and well-being.

## Project Overview

MindMosaic combines an AI-powered chat interface with a rich collection of mental wellness resources, community connections, and blog content, all organized in a beautiful and accessible user interface. The application leverages modern technologies to make mental health information more accessible, personalized, and engaging.

## Features

### User Experience
- **Responsive Design**: Fully responsive layout that adapts to all screen sizes from mobile to desktop
- **Dark/Light Mode**: Complete theme support with consistent color schemes
- **Intuitive Navigation**: Seamless transitions between different sections of the application

### Core Functionality
- **AI Chat Assistant**: Mood-aware AI chatbot that provides empathetic responses and personalized recommendations
- **Mental Wellness Blog**: Curated articles from mental health professionals and wellness experts
- **Community Connections**: Connect with others on similar wellness journeys (in development)
- **User Authentication**: Secure registration and login with JWT-based authentication
- **Personalized Experience**: Saved preferences and chat history for returning users

## Technical Implementation

### Frontend (Next.js)
- **Framework**: Next.js 14 with React 18 
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Hooks and Context API
- **Authentication**: NextAuth.js integration with MongoDB
- **UI Components**:
  - TopBar: Smart navigation with responsive design
  - Sidebar: Context-aware menu navigation
  - ChatArea: Interactive AI chat interface
  - BlogsArea: Featured mental wellness content
  - Settings: User preference management
  - Community: Connection with others (in development)

### Backend (Python)
- **API**: FastAPI implementation
- **AI Model**: Mistral-7B-Instruct for intelligent conversation
- **Emotion Detection**: Advanced NLP for mood-aware responses
- **Recommendation Engine**: Personalized suggestions for books, movies, and music

### Database
- **Primary Database**: MongoDB Atlas
- **Schema**: User profiles, chat history, preferences, blog content
- **Authentication**: JWT token-based auth with secure password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MongoDB Atlas account

### Frontend Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/MindMosaic.git
   ```

2. Navigate to the frontend directory
   ```
   cd MindMosaic/frontend
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the development server
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory
   ```
   cd ../backend
   ```

2. Install Python dependencies
   ```
   pip install -r requirements.txt
   ```

3. Create necessary environment variables (see backend documentation)

4. Run the backend server
   ```
   python main.py
   ```

## Project Status

- ✅ **Frontend UI**: Complete with responsive design and theme support
- ✅ **Backend API**: Functional with AI-powered chat capabilities
- ✅ **Database Integration**: MongoDB Atlas connection established
- ✅ **Authentication**: User registration and login implemented
- ✅ **Blog Content**: Curated articles and content management
- ✅ **Community Features**: Completed

## Future Development

- Enhanced personalization based on user interaction
- 1-1 Connect Integration with WebRTC
- Mobile application with push notifications
- Additional wellness tools and resources

---

*MindMosaic is committed to creating accessible mental wellness resources and support for everyone.*
