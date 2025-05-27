import "./App.css";
import Header from "./components/Header/Header";
import LandingPage from "./Pages/LandingPage";
import GistDetailsPage from "./Pages/GistDetailsPage/GistDetailsPage";

import { AppProvider } from "./context/AppContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateGistPage from "./Pages/CreateGistPage/CreateGistPage";
import PageLayout from "./components/Layout/PageLayout";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
  // const isLoggedIn = !!sessionStorage.getItem("authToken");
  return (
    <AppProvider>
      <Router>
        <Header />
        <PageLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/gist/:id" element={<GistDetailsPage />} />
                <Route path="/create-gist" element={<CreateGistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
        </PageLayout>
      </Router>
    </AppProvider>
  );
}

function TestToast() {
  return (
    <Button onClick={() => message.success("Toast works!")}>
      Show Toast
    </Button>
  );
}
export default App;
