import React, {useEffect} from "react";
import Header from "../components/Header";
import {checkAuth} from "../features/auth/slice/authSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-4 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Tracker App. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
