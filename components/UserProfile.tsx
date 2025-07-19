import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile = ({ onClose }: UserProfileProps) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-64">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          {session.user.image && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {session.user.email}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 