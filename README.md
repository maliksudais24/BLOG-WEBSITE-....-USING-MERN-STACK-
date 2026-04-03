# MERN Blog Platform

A full-stack blog application where users can sign up, log in, create category-wise blogs, and interact with others' posts through likes and comments. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled using Tailwind CSS.

## Features

- **Authentication & Authorization**
  - JWT-based signup, login, and logout
  - Protected routes for authenticated users
- **User Dashboard**
  - Each user manages their own profile and blogs
- **Blog Management**
  - Create, read, update, and delete blogs
  - Categorize blogs (e.g., Technology, Lifestyle, Travel, etc.)
- **Homepage & Filtering**
  - View all blogs on the homepage
  - Filter blogs by category
- **Social Interaction**
  - Like/unlike any blog
  - Add comments on any blog (persisted in database)
- **Responsive Design**
  - Fully responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React (with hooks & context API for state management)
- Tailwind CSS
- Axios (for API calls)
- React Router DOM

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT) for authentication
- Bcrypt.js for password hashing
- MongoDB (with Mongoose ODM)

### Database
- MongoDB Atlas (or local MongoDB instance)

## Project Structure

mern-blog-platform/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── blogController.js
│ │ ├── likeController.js
│ │ └── commentController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
| | utilis /
| | |-- apihandler.js
| | |-- apiresponse.js
| | |-- apierror.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Blog.js
│ │ ├── Like.js
│ │ └── Comment.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── blogRoutes.js
│ │ ├── likeRoutes.js
│ │ └── commentRoutes.js
│ ├── .env
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── BlogCard.jsx
│ │ │ ├── CommentSection.jsx
│ │ │ └── ...
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── CreateBlog.jsx
│ │ │ ├── CategoryPage.jsx
│ │ │ └── BlogDetail.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── App.js
│ │ ├── index.js
│ │ └── index.css
│ ├── .env
│ ├── package.json
│ └── tailwind.config.js
└── README.md
