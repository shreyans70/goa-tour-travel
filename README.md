# Goa Tour Travel

A full-stack travel agency website for Goa tour packages. Built with Node.js, Express, MongoDB, HTML, CSS, and JavaScript.

## Features
- **Public Pages**: Home, Packages, Places, Gallery, About, Contact
- **Authentication**: User and Admin login/signup with JWT
- **User Dashboard**: View packages, place bookings, manage profile, WhatsApp inquiry
- **Admin Dashboard**: Manage packages, places, gallery, bookings, users, and contact messages
- **Responsive Design**: fully responsive across desktop and mobile

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcrypt

## Folder Structure
```
goa-tour-travel/
├── backend/       # Node.js Express server
└── frontend/      # Vanilla HTML, CSS, JS frontend
```

## How to Run Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the MongoDB URI and JWT Secret.
4. Run `npm run seed` (Optional, to populate default data and admin account)
5. `npm run dev` (Starts server on port 5000 using nodemon)

## How to Run Frontend
1. Open the `frontend/html/index.html` file in a browser, or use a tool like VSCode Live Server.
2. The frontend will connect to `http://localhost:5000` by default. (You can change this in `frontend/js/main.js`).

## Default Admin Credentials
- **Email**: shreyansprajapati8957@gmail.com
- **Password**: admin123

(Ensure you have run the seed script to create this account).

## Deployment
See `render-deployment-guide.md` for steps on deploying to Render.
