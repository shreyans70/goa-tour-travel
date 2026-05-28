# Render Deployment Guide

This guide explains how to deploy the Goa Tour Travel full-stack application to Render.

## Prerequisites
- A GitHub account.
- A Render account (render.com).
- A MongoDB Atlas account and cluster.

## Step 1: Prepare the Repository
1. Initialize a Git repository in the root folder (`goa-tour-travel`).
2. Add a `.gitignore` file in the `backend/` directory to ignore `node_modules` and `.env`.
3. Push your code to a new GitHub repository.

## Step 2: Deploy the Backend (Web Service)
1. Go to your Render Dashboard and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `goa-tour-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add Environment Variables under **Advanced**:
   - `PORT`: `5000` (or Render default)
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong random string for JWT.
5. Click **Create Web Service**.
6. Once deployed, note the provided backend URL (e.g., `https://goa-tour-backend.onrender.com`).

## Step 3: Update Frontend API URL
1. Open `frontend/js/main.js` (or wherever your base API URL is defined).
2. Change the API URL from `http://localhost:5000` to your Render backend URL.
3. Commit and push this change to GitHub.

## Step 4: Deploy the Frontend (Static Site)
1. In the Render Dashboard, click **New > Static Site**.
2. Connect your GitHub repository again.
3. Configure the following settings:
   - **Name**: `goa-tour-frontend`
   - **Build Command**: Leave blank (it's vanilla HTML/CSS/JS).
   - **Publish Directory**: `frontend` (or `frontend/html` if you structure it so the index is there, but typically it's the root of the frontend folder. Note: Our structure has `frontend/html/index.html`. You may need to move `index.html` to the `frontend/` root or set the publish directory to `frontend` and redirect).
   *Recommendation*: If Render requires an `index.html` at the root of the publish directory, you might need to copy `frontend/html/index.html` to `frontend/index.html` or configure rewrites.
4. Click **Create Static Site**.
5. Your frontend is now live and will communicate with your deployed backend!
