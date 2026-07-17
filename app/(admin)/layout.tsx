export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <span className="text-sm text-gray-500">(Auth coming Week 05)</span>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl p-4">{children}</main>
    </div>
  );
}