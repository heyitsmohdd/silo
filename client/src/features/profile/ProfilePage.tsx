import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { Mail, Shield, Calendar, GitBranch, Edit2, Lock, User, Trash2 } from 'lucide-react';
import axiosClient from '@/lib/axios';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import { getIdentity } from '@/lib/identity';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<'profile' | 'edit' | 'password' | 'delete'>('profile');

  // Guard: don't render if user is null
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      window.location.href = '/login';
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
    )) {
      return;
    }

    try {
      await axiosClient.delete('/auth/account');
      logout();
      window.location.href = '/login';
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card - Anonymous Identity */}
      {(() => {
        const identity = getIdentity(user.userId);
        return (
          <div className="glass-card p-8 overflow-hidden border border-zinc-800">
            <div className="flex items-center gap-6">
              {/* Large Robot Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={identity.avatar}
                  alt={identity.name}
                  className="w-20 h-20 rounded-full bg-zinc-900 ring-4 ring-zinc-800 shadow-2xl shadow-violet-500/10"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 ring-4 ring-zinc-950 animate-pulse" />
              </div>

              {/* Anonymous Codename */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {identity.name}
                  </h1>
                  <div className="px-2.5 py-0.5 rounded-md bg-zinc-800/60 border border-zinc-700">
                    <span className="text-xs font-mono text-zinc-400">ANON</span>
                  </div>
                </div>

                {/* Secondary Metadata */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/40 border border-zinc-700">
                    <Shield className="w-3 h-3 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">
                      {user.role === 'STUDENT' ? 'Student' : 'Professor'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    {user.year} • {user.branch}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        );
      })()}

      {/* Content Area - Scrollable */}
      <div className="max-h-[60vh] overflow-y-auto">
        {/* Edit Profile Section */}
        {activeView === 'edit' && (
          <EditProfile
            user={user}
            onCancel={() => setActiveView('profile')}
            onSuccess={() => {
              setActiveView('profile');
              window.location.reload();
            }}
          />
        )}

        {/* Change Password Section */}
        {activeView === 'password' && (
          <ChangePassword
            onCancel={() => setActiveView('profile')}
            onSuccess={() => {
              setActiveView('profile');
              window.location.reload();
            }}
          />
        )}

        {/* Delete Account Section */}
        {activeView === 'delete' && (
          <div className="glass-card border-red-500/20 bg-red-500/5 p-6 mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-destructive">Delete Account</h2>
                  <p className="text-sm text-destructive">This action is permanent and cannot be undone. Please confirm carefully.</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                All your notes and content will be permanently deleted from the database.
              </p>

              <p className="text-sm text-muted-foreground">
                Your chat messages will be permanently deleted from the database.
              </p>

              <p className="text-sm text-muted-foreground">
                Your account information will be removed.
              </p>

              <p className="text-sm text-muted-foreground">
                You will be logged out immediately.
              </p>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setActiveView('profile')}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800/40 transition-colors text-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Default View - Profile Details */}
        {activeView === 'profile' && (
          <div className="glass-card p-6 border border-zinc-800">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-zinc-100">Account Information</h2>
              </div>

              <div className="space-y-4">
                {/* Real Email - Secondary */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <Mail className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-sm text-zinc-200 font-mono">{user.userId}</p>
                  </div>
                </div>

                {/* Role - Secondary */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <Shield className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Role</p>
                    <p className="text-sm text-zinc-200 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>

                {/* Batch Info */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Batch Context</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-500">Year:</span>
                        <span className="text-sm text-zinc-200 font-mono">{user.year}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="w-3 h-3 text-zinc-500" />
                        <span className="text-sm text-zinc-200 font-mono">{user.branch}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Name - If set */}
                {(user.firstName || user.lastName) && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                    <User className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Real Name</p>
                      <p className="text-sm text-zinc-200">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || user.lastName || 'Not set'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setActiveView('edit')}
                  variant="ghost"
                  className="flex-1 border border-zinc-700 hover:border-zinc-600"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setActiveView('password')}
                  variant="ghost"
                  className="flex-1 border border-zinc-700 hover:border-zinc-600"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          onClick={() => setActiveView('delete')}
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </div>


    </div >
  );
};

export default ProfilePage;
