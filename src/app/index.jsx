import './styles/index.css';

// app shell — wraps the app with providers and global layout
function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-void text-text-primary">
      {children}
    </div>
  );
}

export default AppShell;
