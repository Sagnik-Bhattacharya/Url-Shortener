# Url-Shortener

Url-Shortener is a full-featured URL shortening service built with Next.js, React, MongoDB, and TailwindCSS. It provides a simple and elegant interface to create short URLs that redirect to original long URLs. Users can register, log in, manage their short links, track clicks, generate QR codes, and copy short URLs easily.

## Features

- User authentication with JWT and secure password hashing
- Create, edit, and delete short URLs
- Set expiry for URLs (optional)
- Click tracking for each short URL
- Generate QR codes for short URLs
- Copy short URLs to clipboard with one click
- Responsive and modern UI with TailwindCSS and Framer Motion animations
- Easy-to-use dashboard for link management

## Tech Stack

- Frontend: Next.js (React), TailwindCSS, Framer Motion
- Backend: Next.js API routes, MongoDB, Mongoose
- Authentication: JWT, bcryptjs
- Notifications: react-hot-toast

## Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB Atlas or local MongoDB instance
- (Optional) .env file for environment variables

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sagnik-Bhattacharya/Url-Shortener.git
   cd Url-Shortener
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the root directory with the following environment variables:

ini
Copy
Edit
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:3000
Run the development server:

bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser.

Usage
Register a new account or log in.

Create new short URLs by entering the original long URL.

Manage your links from the dashboard: edit, delete, view click stats, and generate/download QR codes.

Click the "Copy URL" button to copy the shortened link to your clipboard.
This project was built by Sagnik Bhattacharya with assistance from AI tools like Claude.
