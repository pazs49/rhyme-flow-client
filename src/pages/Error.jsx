import { Link } from "react-router-dom";

export const Error = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center text-white">
        <h1 className="text-9xl font-extrabold tracking-widest text-green-500">
          404
        </h1>
        <p className="text-2xl mt-4 font-semibold">Page Not Found</p>
        <p className="mt-2 text-gray-400">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
