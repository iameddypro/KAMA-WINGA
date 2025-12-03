
# Kama Winga - Social Visual Search App

Kama Winga is a React-based social platform for finding products using photos, featuring AI analysis, a vertical feed, and a blockchain-inspired UI.

## 🚀 How to Deploy

You can deploy this application for free using **Vercel** or **Netlify**.

### Option 1: Vercel (Recommended)

1.  **Clone/Download** this project to your computer or push it to your GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up/log in.
3.  Click **"Add New Project"**.
4.  Import your GitHub repository.
5.  **Build Settings**:
    *   Framework Preset: `Create React App` (or `Vite` if you migrate).
    *   Build Command: `npm run build`
    *   Output Directory: `build` (or `dist`)
6.  **Environment Variables**:
    *   Add your Google Gemini API Key:
    *   Name: `REACT_APP_GEMINI_API_KEY` (or process.env variable name used in code)
    *   Value: `Your_Actual_API_Key`
7.  Click **Deploy**.

### Option 2: Netlify

1.  Go to [Netlify.com](https://www.netlify.com).
2.  Click **"Add new site"** -> **"Import from existing project"**.
3.  Connect your GitHub.
4.  **Build Settings**:
    *   Build command: `npm run build`
    *   Publish directory: `build`
5.  Click **Deploy Site**.

## 🛠️ Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the server:
    ```bash
    npm start
    ```

## 📱 Features

*   **Visual Search**: Snap a photo, AI analyzes it.
*   **Vertical Feed**: Snapchat/TikTok style immersive feed.
*   **Verification System**: Blue, Gold, and Diamond tiers.
*   **Polymarket Trends**: Vote on market predictions.
*   **Multilingual**: Swahili & English.

## 📧 Email Service Simulation

The app currently uses a Mock Database.
*   **OTP**: Verification codes are simulated in the browser console.
*   **Sender**: Simulated as `Ardbeatz5@gmail.com`.
*   **Demo Code**: Use `123456` to verify any account.
