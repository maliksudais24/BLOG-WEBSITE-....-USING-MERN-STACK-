import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import Forgetpass from './components/forgetpass'
import { AuthProvider } from './context/AuthContext'
import Home from './components/Home.jsx'
import Write from './components/Write.jsx'
import Category from './components/Category.jsx'
import Contact from './components/Contact.jsx'
import MyBlogs from './components/MyBlogs.jsx'
import BlogView from './components/BlogView.jsx'
import EditBlog from './components/EditBlog.jsx'

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/categories/:categoryId" element={<Category />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/blog/:blogId" element={<BlogView />} />
        <Route path="/edit/:blogId" element={<EditBlog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpass" element={<Forgetpass />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
