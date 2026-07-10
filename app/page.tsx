// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-700 mb-4">
            TeamSync
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Student Project Management Hub — Keep your team organized, track tasks, and hit deadlines together.
          </p>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">📋 Task Board</h3>
            <p className="text-gray-600">Drag tasks from To-Do to Done</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">💬 Team Chat</h3>
            <p className="text-gray-600">Discuss tasks with your team</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">📊 Dashboard</h3>
            <p className="text-gray-600">See your team's progress at a glance</p>
          </div>
        </div>
      </div>
    </div>
  );
}