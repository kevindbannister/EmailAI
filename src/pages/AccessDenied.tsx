const AccessDenied = () => (
  <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 px-6 text-center">
    <h1 className="text-2xl font-semibold text-slate-100">Access Denied</h1>
    <p className="max-w-md text-sm text-slate-300">
      You do not have permission to view this page.
    </p>
  </div>
);

export default AccessDenied;
