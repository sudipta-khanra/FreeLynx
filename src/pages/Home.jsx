import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-8">
  <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 max-w-full sm:max-w-xl w-full text-center border border-gray-200">
    <h1 className="text-lg sm:text-3xl md:text-5xl font-extrabold text-blue-700 mb-3 sm:mb-5 drop-shadow-sm">
      Welcome to <span className="text-blue-900">FreeLynx</span>
    </h1>

    {user ? (
      <p className="text-sm sm:text-base md:text-lg text-gray-800 bg-blue-50 px-3 sm:px-6 py-2 sm:py-3 rounded-lg border border-blue-100">
        You’re logged in as{" "}
        <span className="font-bold text-blue-700">{user.name}</span>{" "}
        <span className="italic text-gray-600">({user.role})</span>
      </p>
    ) : (
      <p className="text-sm sm:text-base md:text-lg text-gray-600 bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-200">
        Please{" "}
        <span className="font-semibold text-blue-600">login</span> or{" "}
        <span className="font-semibold text-blue-600">register</span> to get started.
      </p>
    )}
  </div>
</div>


);

}
