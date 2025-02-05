const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="relative bg-white dark:bg-slate-950 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
