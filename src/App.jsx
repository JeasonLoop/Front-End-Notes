import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AllNotes from './pages/AllNotes';
import Category from './pages/Category';
import NoteDetail from './pages/NoteDetail';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-notes" element={<AllNotes />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/notes/:slug" element={<NoteDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
