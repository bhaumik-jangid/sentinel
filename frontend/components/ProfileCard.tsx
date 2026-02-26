"use client";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email?: string;
    createdAt?: string;
  };
  isOwnProfile?: boolean;
  onLogout?: () => void;
}

export default function ProfileCard({
  user,
  isOwnProfile = false,
  onLogout,
}: ProfileCardProps) {
  const initial = user.name?.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
      
      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-950 text-white flex items-center justify-center text-3xl font-semibold shadow-md">
          {initial}
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-gray-950">
          {user.name}
        </h2>

        {user.email && (
          <p className="text-gray-500 text-sm mt-1">
            {user.email}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-gray-100" />

      {/* Details */}
      <div className="space-y-5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span className="font-medium text-gray-800">User ID</span>
          <span className="truncate max-w-55 text-right">
            {user.id}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="font-medium text-gray-800">Account Status</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>

        {user.createdAt && (
          <div className="flex justify-between text-gray-600">
            <span className="font-medium text-gray-800">Member Since</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Logout (Only for Own Profile) */}
      {isOwnProfile && (
        <div className="mt-10">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-gray-950 text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}