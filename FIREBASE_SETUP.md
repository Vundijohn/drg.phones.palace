# 🔥 Firebase Backend Guide — DRG Phones Palace

This backend supports both **Firebase Realtime Database (RTDB)** and **Google Cloud Firestore** for project **`phones-3355c`**, with automatic fallback to local JSON storage.

---

## 📋 System Configuration

- **Firebase Project ID**: `phones-3355c`
- **Realtime Database URL**: `https://phones-3355c-default-rtdb.firebaseio.com/`
- **Storage Bucket**: `phones-3355c.firebasestorage.app`
- **Active Fallback**: If Firebase is locked or offline, the server runs smoothly on the local JSON store (`data/*.json`).

---

## 🚀 Activating Firebase Realtime Database (1 Minute)

Your Realtime Database is already created at `https://phones-3355c-default-rtdb.firebaseio.com/`. By default, Firebase locks new databases with security rules (`Permission Denied`).

### Step 1: Allow Read & Write in Firebase Console

1. Open your browser to the Realtime Database Rules tab:  
   👉 **[https://console.firebase.google.com/project/phones-3355c/database/phones-3355c-default-rtdb/rules](https://console.firebase.google.com/project/phones-3355c/database/phones-3355c-default-rtdb/rules)**
2. Replace the rules content with:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. Click **Publish**.

---

### Step 2: Seed the Catalogue to Firebase

Once rules are published, seed the catalogue with one command:

```powershell
npm run firebase:seed
```

This will automatically create:
- **`/phones`**: All 18 Samsung, iPhone, and Motorola phones.
- **`/admin/security`**: Initial PIN hash (Default PIN: `2540`).
- **`/settings/general`**: Store WhatsApp number (`254797951374`) and store name.

---

### Step 3: Start the Backend Server

Start the development server:

```powershell
npm run dev
```

Or standard start:

```powershell
npm start
```

Your server will boot up and connect:
```text
=============================================
🚀 DRG Phones Palace Server running!
🌐 Public Website:   http://localhost:3000/
👑 Admin Dashboard:  http://localhost:3000/admin.html
⚡ API Health:       http://localhost:3000/api/health
🔥 Firebase Project: phones-3355c
🌐 RTDB URL:         https://phones-3355c-default-rtdb.firebaseio.com/
=============================================
```

---

## 🔒 Alternative: Admin SDK Private Key (No Rule Changes Needed)

If you prefer to keep security rules locked and grant the backend direct admin access:
1. In Firebase Console, go to **Project Settings** (gear icon) ➔ **Service Accounts**.
2. Click **Generate new private key**.
3. Save the downloaded `.json` file in the project root as `serviceAccountKey.json`.
4. The backend will automatically detect it and connect with full administrative privileges.

---

## ⚡ Checking Database Engine Status

Check the active engine anytime:
- In browser: `http://localhost:3000/api/admin/status`
- In terminal:
  ```powershell
  npm run firebase:status
  ```
- In Admin Dashboard: Look at the badge in the top navigation bar (`📡 Realtime Database` / `🔥 Cloud Firestore` / `💾 Local Store`).
