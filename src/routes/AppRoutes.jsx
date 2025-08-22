import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import PostJob from "../pages/PostJob";
import BrowseJobs from "../pages/BrowseJobs";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import MyJobs from "../pages/MyJobs";
import JobDetails from "../pages/JobDetails";
import JobProposals from "../pages/JobProposals";
import EditJob from "../pages/EditJob";
import Profile from "../pages/Profile";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import Contact from "../pages/Contact";
import MyProposals from "../pages/MyProposals";
import ProposalList from "../pages/ProposalList";
import FreelancerProfile from "../pages/FreelancerProfile";
import ChatPage from "../pages/ChatPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        {/* Protected Route - accessible to both clients and freelancers */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JobDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Role-protected Routes */}

        {/* Client-only Routes */}
        <Route
          path="/post-job"
          element={
            <RoleProtectedRoute allowedRoles={["client"]}>
              <MainLayout>
                <PostJob />
              </MainLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <RoleProtectedRoute allowedRoles={["client"]}>
              <MainLayout>
                <MyJobs />
              </MainLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/my-jobs/:jobId/proposals"
          element={
            <RoleProtectedRoute allowedRoles={["client"]}>
              <MainLayout>
                <JobProposals />
              </MainLayout>
            </RoleProtectedRoute>
          }
        />

        {/* Freelancer-only Routes */}
        <Route
          path="/jobs"
          element={
            <RoleProtectedRoute allowedRoles={["freelancer"]}>
              <MainLayout>
                <BrowseJobs />
              </MainLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/my-jobs/:id/edit" // or use :jobId to be consistent
          element={
            <RoleProtectedRoute allowedRoles={["client"]}>
              <MainLayout>
                <EditJob />
              </MainLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JobDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/terms"
          element={
            <MainLayout>
              <Terms />
            </MainLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <MainLayout>
              <Privacy />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/my-proposals"
          element={
            <MainLayout>
              <MyProposals />
            </MainLayout>
          }
        />
        <Route
          path="/proposals"
          element={
            <MainLayout>
              <MyProposals />
            </MainLayout>
          }
        />
        <Route
          path="/proposals-list"
          element={
            <MainLayout>
              <ProposalList />
            </MainLayout>
          }
        />

        <Route
          path="/freelancers/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FreelancerProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChatPage
                  token={localStorage.getItem("token") || ""}
                  me={
                    localStorage.getItem("user")
                      ? JSON.parse(localStorage.getItem("user"))
                      : null
                  }
                />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
