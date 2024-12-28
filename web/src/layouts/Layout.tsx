import React, { useEffect } from "react";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  useEffect(() => {
    document.title = "SolidKey | " + title; // Cambia el título de la página
  }, [title]); // Se ejecuta cuando el título cambia

  return <>{children}</>;
};

export default Layout;
