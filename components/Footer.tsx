export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Sacrament Meeting Planner. All rights reserved.</p>
      </div>
    </footer>
  );
}