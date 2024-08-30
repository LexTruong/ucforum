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
import Comments from './components/Comments/Comments';
import ViewPastPosts from './pages/ViewPastPosts'
import AccountPage from './pages/AccountPage';
import UpdateAccountPage from './pages/UpdateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/create" element={<CreatePostPage/>} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/edit/:id" element={<EditPostPage />} />
            <Route path="/topic/:name" element={<TopicPage />} />
            <Route path="/post/:id" element={<ViewPostPage />} />
            <Route path="/past" element={<ViewPastPosts/>}/>
            <Route path="/user/:id" element={<ProfilePage />} />
            <Route path="/comments" element={<Comments />}/>
            <Route path="/account" element={<AccountPage />}/>
            <Route path="/update" element={<UpdateAccountPage/>}/>
            <Route path="/forgot" element={<ForgotPasswordPage/>}/>
        </Route>
    </Routes>
  );
}

export default App;
