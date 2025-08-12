import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './screens/landingPage/landingPage';
import SignInPage from './screens/auth/signin';
import SignUpPage from './screens/auth/signup';
import { ROUTES } from './utils/constants';
import Home from './screens/home';
import { loadFonts } from './utils/fonts';
import Layout from './components/layout/layout';
import ProjectLayout from './components/layout/projectLayout';
import ProjectScreen from './screens/project/projectScreen';
import LibraryScreen from './screens/library/libraryScreen';
import PublicRoute from './routes/PublicRoute';
import NoteScreen from './screens/note/noteScreen';
import FreeResponseScreen from './screens/note/freeResponseScreen';


import ToolsMainScreen from './screens/tools/toolsMainScreen';

import FlashcardSetScreen from './screens/studySets/FlashcardSetScreen';
import FlashcardDetailScreen from './screens/studySets/FlashcardDetailScreen';
import MultipleChoiceSetScreen from './screens/studySets/MultipleChoiceSetScreen';
import MultipleChoiceDetailScreen from './screens/studySets/MultipleChoiceDetailScreen';
import StarredFlashcardsScreen from './screens/studySets/StarredFlashcardsScreen';
import StarredFlashcardsDetailScreen from './screens/studySets/StarredFlashcardsDetailScreen';
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
          <Route path="tools" element={<ToolsMainScreen />} />
          <Route path="study-sets/flashcards/:setId" element={<FlashcardSetScreen />} />
          <Route path="study-sets/flashcards/:setId/study" element={<FlashcardDetailScreen />} />
          <Route path="study-sets/flashcards/:setId/study/:cardId" element={<FlashcardDetailScreen />} />
          <Route path="study-sets/multiple-choice/:setId" element={<MultipleChoiceSetScreen />} />
          <Route path="study-sets/multiple-choice/:setId/study" element={<MultipleChoiceDetailScreen />} />
          <Route path="study-sets/multiple-choice/:setId/study/:questionId" element={<MultipleChoiceDetailScreen />} />
          <Route path="starred-flashcards" element={<StarredFlashcardsScreen />} />
          <Route path="starred-flashcards/study" element={<StarredFlashcardsDetailScreen />} />
          <Route path="starred-flashcards/study/:cardId" element={<StarredFlashcardsDetailScreen />} />
          <Route path="note/:noteId" element={<NoteScreen />} />
          <Route path="note/:noteId/free-response" element={<FreeResponseScreen />} />
          

          {/* Add other project-specific routes here */}
        </Route>
      </Route>

      {/* Routes without shared layout */}
      
    </Routes>
  );
}

export default App;
