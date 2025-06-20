import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./provider";
import {
  UsersListPage,
  AuditLogsPage,
  CategoryListPage,
  DemoDetailsPage,
  DemoPage,
  HomePage,
  MappedProductsPage,
  NewDemoPage,
  NewUserPage,
  RegionPage,
  SignInPage,
  UserTypesPage,
  HelpDeskPage,
  ProfilePage,
} from "./pages";
import { MainLayout } from "./layout";
import { ProtectedRoute } from "./utils";
import { ForgotPasswordPage } from "./pages/forgotpassword";
import DepartmentDesignationUpload from "./pages/department-designation-page";
import { ResetPasswordPage } from "./pages/reset-password";
import { ApproveUser } from "./pages/approval-user";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/assigned-products" element={<MappedProductsPage />} />
            <Route path="/new-users" element={<NewUserPage />} />
            <Route path="/approve-users" element={<ApproveUser />} />
            <Route path="/user-types" element={<UserTypesPage />} />
            <Route path="/new-demo" element={<NewDemoPage />} />
            <Route path="/region" element={<RegionPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/demo-details/:id" element={<DemoDetailsPage />} />
            <Route path="need-help" element={<HelpDeskPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="/department-designation"
              element={<DepartmentDesignationUpload />}
            />
          </Route>
        </Route>
        <Route path="/help-desk" element={<HelpDeskPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/*" element={<div>Page not found</div>} />
      </Routes>
    </AppProvider>
  );
}
