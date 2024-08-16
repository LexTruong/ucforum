import './App.css';
import {Routes, Route} from "react-router-dom"
import Layout from "./Layout"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import CreatePostPage from "./pages/CreatePostPage"
import EditPostPage from "./pages/EditPostPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import TopicPage from "./pages/TopicPage"
import ViewPostPage from "./pages/ViewPostPage"
import React from 'react';
import ProfilePage from './pages/ProfilePage';

function App() {

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
            <Route index path="/" element={<HomePage/>} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/create" element={<CreatePostPage/>} />
            <Route path="/signin" element={<SignInPage/>} />
            <Route path="/signup" element={<SignUpPage/>} />
            <Route path="/edit/:id" element={<EditPostPage/>} />
            <Route path="/topic/:name" element={<TopicPage/>} />
            <Route path="/post/:id" element={<ViewPostPage/>} />
            <Route path="/user/:id" element={<ProfilePage />} />
        </Route>
    </Routes>
  );
}

export default App;
