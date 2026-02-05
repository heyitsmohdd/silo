import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { Mail, Shield, Calendar, GitBranch, Edit2, Lock, User, Trash2 } from 'lucide-react';
import axiosClient from '@/lib/axios';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

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
      {/* Header Card */}
      <div className="glass-card p-8 overflow-hidden">
        <div className="flex items-center gap-6">
          <div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-violet-500/20 flex-shrink-0"
          >
            {user.firstName
              ? user.firstName[0]
              : user.userId[0]?.toUpperCase() || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">
              {user.firstName
                ? `${user.firstName} ${user.lastName || ''}`
                : user.userId}
            </h1>

            <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-400">
                {user.role === 'STUDENT' ? 'Active Student' : 'Professor'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

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
          <div className="glass-card p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Profile</h2>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Address</p>
                    <p className="text-sm text-muted-foreground">{user.userId}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>

                {/* Year */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Year</p>
                    <p className="text-sm text-muted-foreground">{user.year}</p>
                  </div>
                </div>

                {/* Branch */}
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Branch</p>
                    <p className="text-sm text-muted-foreground">{user.branch}</p>
                  </div>
                </div>

                {/* Name */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || user.lastName || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setActiveView('edit')}
                  variant="ghost"
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setActiveView('password')}
                  variant="ghost"
                  className="flex-1"
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
