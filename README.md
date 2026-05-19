# BloodLine: Blood Donation Management System

A modern, full-stack web application designed to bridge the gap between blood donors, hospitals, and patients in emergencies.

## Features

- **User Authentication**: Secure Google-based login for Donors and Administrators.
- **Donor Registry**: Users can register as donors, specify blood groups, and locations.
- **Emergency Requests**: Hospitals or patients can post real-time blood requests with urgency levels.
- **Search System**: Find donors by blood group and city with instant contact options.
- **Admin Dashboard**: Comprehensive management of donors, approval of profiles, and request tracking.
- **AI-Powered Analysis**: Integrated Gemini AI to analyze blood demand and provide insights on shortages.
- **Responsive Design**: High-performance UI built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database & Auth**: Firebase Firestore & Firebase Authentication.
- **AI**: Google Gemini API.

## Setup Instructions

1. **Firebase Configuration**:
   - The app uses Firebase for data storage and auth. 
   - Ensure you have accepted the Firebase terms in the setup UI.
   - Configuration is automatically managed via `firebase-applet-config.json`.

2. **Environment Variables**:
   - `GEMINI_API_KEY`: Required for the AI Assistant features (Injected automatically).

3. **Development**:
   - Run `npm run dev` to start the full-stack development server.
   - The app will be available on port 3000.

## Folder Structure

- `/src/pages`: Main application views (Home, Login, Search, Admin, etc.)
- `/src/components`: Reusable UI elements (Navbar, Cards, etc.)
- `/src/context`: Authentication and global state management.
- `/src/lib`: Utility functions and Firebase SDK initialization.
- `/server.ts`: Express server with Vite middleware and AI endpoints.
- `/firestore.rules`: Security rules for data protection.

## Safety Note

Always verify medical information with professionals. This platform is a connector and should be used responsibly during emergencies.
