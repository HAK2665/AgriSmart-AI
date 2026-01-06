<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
🌱 AgriSmart AI – Intelligent Crop & Disease Advisory System

AgriSmart AI is a full-stack, production-ready web application designed for farmers and agricultural professionals.
The platform uses AI-powered image recognition, soil & weather analysis, and expert agricultural knowledge to provide accurate disease detection, organic & chemical remedies, and crop recommendations.

🚀 Problem Statement

Farmers often face:

Difficulty in identifying crop diseases accurately

Lack of timely and correct remedies

Confusion between organic vs chemical solutions

Poor crop yield due to unsuitable soil and weather conditions

No centralized digital system to track crops, diseases, and soil data

🎯 Solution Overview

AgriSmart AI solves these problems by providing:

AI-based crop disease detection from images

Organic and chemical treatment recommendations

Soil nutrition based crop suggestion system

Secure user profile and data management

High-precision search engine for crops and diseases

Cloud-based scalable architecture

🧠 Key Features
👤 User Authentication & Profile

Secure login/signup using Firebase Authentication

User can:

Update profile details

View uploaded crops & disease history

Store all data securely in Firestore

📷 Crop Disease Detection (AI Powered)

User uploads crop/disease images

AI model analyzes the image

System identifies:

Crop name

Disease name

Severity level

💊 Intelligent Remedy Recommendation

For each detected disease, the system provides:

🌿 Organic Remedies

Bio-fertilizers

Neem-based solutions

Natural pesticides

Compost and soil treatment

🧪 Chemical Remedies

Recommended fungicides

Insecticides

Weedicides

Proper dosage and application method

⚠️ Disclaimer included for safe chemical usage

🔍 Advanced Crop & Disease Search

High-precision AI-assisted search engine

Search by:

Crop name

Disease name

Symptoms

Instant suggestions with AI ranking

🌾 Soil & Weather Based Crop Recommendation

User inputs:

Nitrogen (N)

Phosphorus (P)

Potassium (K)

Soil pH

Moisture level

Local weather data (optional)

System outputs:

Best suitable crops

Expected yield insights

Fertilizer recommendations

Seasonal suitability

☁️ Cloud Data Storage

Firestore Database stores:

User profiles

Uploaded images

Disease history

Soil data

Recommendations

Real-time updates

Scalable and secure

🛠️ Tech Stack
Frontend

HTML5

CSS3

JavaScript (ES6+)

Responsive UI (Mobile & Desktop)

Backend

Firebase Cloud Functions

Firestore Database

Firebase Authentication

AI & APIs

Gemini AI API (for image analysis & recommendations)

Optional:

Weather API

External agricultural datasets

🧩 System Architecture
Frontend (HTML/CSS/JS)
        |
Firebase Authentication
        |
Firestore Database
        |
Cloud Functions
        |
Gemini AI API (Image + Text Analysis)

🔐 Environment Variables & API Keys

⚠️ DO NOT hardcode API keys

Create a .env file:

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

GEMINI_API_KEY=

WEATHER_API_KEY=


All API key fields are intentionally left EMPTY for security.

📁 Project Folder Structure
AgriSmart-AI/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│
├── src/
│   ├── css/
│   ├── js/
│   │   ├── auth.js
│   │   ├── imageUpload.js
│   │   ├── diseaseDetection.js
│   │   ├── soilAnalysis.js
│   │   ├── searchEngine.js
│
├── firebase/
│   ├── firebaseConfig.js
│   ├── firestoreService.js
│
├── functions/
│   ├── index.js
│
├── .env
├── README.md
└── package.json

🧪 Sample Firestore Data Model
Users Collection
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "location": "string",
  "createdAt": "timestamp"
}

Crop Analysis Collection
{
  "userId": "string",
  "cropName": "string",
  "disease": "string",
  "organicRemedy": [],
  "chemicalRemedy": [],
  "imageURL": "string",
  "timestamp": "timestamp"
}

🧠 AI Workflow

User uploads image

Image sent to Gemini AI

AI detects disease

AI maps disease → remedy database

Results stored in Firestore

Output shown to user

🏆 Hackathon-Winning Points

✔ Real-world problem
✔ AI integration
✔ Scalable cloud architecture
✔ Clean UI & UX
✔ Production-ready MVP
✔ Security best practices
✔ Farmer-centric solution

🚧 Future Enhancements

Mobile App (Flutter / React Native)

Multilingual support (Marathi / Hindi)

IoT sensor integration

Offline mode

Government scheme recommendations

Market price prediction

⚠️ Disclaimer

This application provides advisory recommendations only.
Always consult certified agricultural experts before applying chemical treatments.

👨‍💻 Author

Developed for Hackathons & Real-World Agricultural Impact

If you use this project, ⭐ star it and customize it to fit your innovation vision.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the Firebase configuration i.e, `firebaseconfig` in firebase.ts file
3. Set the `GEMINI_API_KEY` and `EXPERT_SEARCH_API` in [.env.local](.env.local) to your Gemini API key (Two API keys will be needed)
4. Set the `WEATHER_API` in weatherService.ts file
5. Run the app:
   `npm run dev`
