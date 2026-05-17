import React, { useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import GenerateImages from './pages/GenerateImages'
import RemoveObject from './pages/RemoveObject'
import RemoveBackgroung from './pages/RemoveBackgroung'
import ReviewResume from './pages/ReviewResume'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import Layout from './pages/Layout'
import Community from './pages/Community'
import { useAuth } from '@clerk/react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  // const {getToken}=useAuth();
  // useEffect(() => {
  //   getToken().then((token) => {
  //     console.log(token);
  //   })
  // }, []);
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="remove-background" element={<RemoveBackgroung />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App