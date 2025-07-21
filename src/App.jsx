import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './screens/landingPage/landingPage';
import SignInPage from './screens/auth/signin';
import SignUpPage from './screens/auth/signup';
import { ROUTES } from './utils/constants';
import Home from './screens/home';
import { loadFonts } from './utils/fonts';
import Layout from './screens/layout/layout';
import ProjectLayout from './screens/layout/projectLayout';
import ProjectScreen from './screens/project/projectScreen';
import LibraryScreen from './screens/library/libraryScreen';
import PublicRoute from './routes/PublicRoute';
import NoteScreen from './screens/note/noteScreen';
import FlashCardMainScreen from './screens/note/flashCardMainScreen';
import FlashcardScreen from './screens/note/flashcardScreen';
import FreeResponseScreen from './screens/note/freeResponseScreen';
import MultipleChoiceScreen from './screens/note/multipleChoiceScreen';

function App() {
  useEffect(() => {
    // Load fonts programmatically as a fallback
    loadFonts();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<SignInPage />} />
        <Route path={ROUTES.REGISTER} element={<SignUpPage />} />
      </Route>

      {/* Routes with shared layout */}
      <Route path={ROUTES.LANDING} element={<LandingPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        
        {/* Project-specific routes with shared layout */}
        <Route path="/project/:projectId" element={<ProjectLayout />}>
          <Route index element={<ProjectScreen />} />
          <Route path="library" element={<LibraryScreen />} />
          <Route path="tools" element={<div />} />
          <Route path="note/:noteId" element={<NoteScreen />} />
          <Route path="note/:noteId/flashcards" element={<FlashCardMainScreen />} />
          <Route path="note/:noteId/flashcards/study" element={<FlashcardScreen />} />
          <Route path="note/:noteId/free-response" element={<FreeResponseScreen />} />
          <Route path="note/:noteId/multiple-choice" element={<MultipleChoiceScreen />} />

          {/* Add other project-specific routes here */}
        </Route>
      </Route>

      {/* Routes without shared layout */}
      
    </Routes>
  );
}

export default App;
