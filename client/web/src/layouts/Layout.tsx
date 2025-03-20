type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  document.title = 'SolidKey - ' + title;
  return <main>{children}</main>;
};
