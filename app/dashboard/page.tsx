// app/dashboard/page.tsx
'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600">5</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">7</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">Team Tasks</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span>📝 Write project proposal</span>
              <span className="text-sm text-yellow-600">In Progress</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>🎨 Design wireframes</span>
              <span className="text-sm text-green-600">Done</span>
            </div>
            <div className="flex justify-between items-center">
              <span>💻 Set up database</span>
              <span className="text-sm text-red-600">To Do</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}