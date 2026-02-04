import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { LogOut, Mail, Shield, Calendar, GitBranch, Edit2, Lock, Trash2 } from 'lucide-react';
import DetailRow from '@/components/ui/DetailRow';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<'profile' | 'edit' | 'password' | 'delete'>('profile');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      window.location.reload();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div
            style={{ background: getAvatarGradient(user.userId) }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
          >
            {getInitials()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              {getDisplayName()}
            </h1>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {user.role === 'STUDENT' ? 'Active Student' : 'Professor'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('edit')}
            className={`flex-1 items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeView === 'edit'
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveView('password')}
            className={`flex-1 items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeView === 'password'
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {activeView === 'profile' && (
          <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Edit Profile</h2>
              <button
                onClick={() => setActiveView('profile')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <EditProfile
              user={user}
              onCancel={() => setActiveView('profile')}
              onSuccess={() => {
                setActiveView('profile');
                window.location.reload();
              }}
            />
          </div>
        )}

        {activeView === 'password' && (
          <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Change Password</h2>
              <button
                onClick={() => setActiveView('profile')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <ChangePassword
              onCancel={() => setActiveView('profile')}
              onSuccess={() => {
                setActiveView('profile');
                alert('Password changed successfully!');
              }}
            />
          </div>
        )}

        {activeView === 'delete' && (
          <div className="bg-card border border-destructive/20 rounded-lg shadow-soft-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-destructive">Delete Account</h2>
              <button
                onClick={() => setActiveView('profile')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-destructive mb-4">
                This action is permanent and cannot be undone. Please confirm carefully.
              </p>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>All your notes and content will be permanently deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Your chat messages will be deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Your account information will be removed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>You will be logged out immediately</span>
                </li>
              </ul>

              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full mt-4"
              >
                Delete Account
              </Button>
            </div>

            <Button
              onClick={() => setActiveView('profile')}
              variant="outline"
              className="w-full mt-2"
              disabled={handleDeleteAccount === undefined}
              >
                Cancel
              </Button>
            </div>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-2">
        <DetailRow
          icon={Mail}
          label="Email"
          value={user.userId}
          truncate
        />
        <DetailRow
          icon={Shield}
          label="Role"
          value={user.role.toLowerCase()}
        />
        <DetailRow
          icon={Calendar}
          label="Year"
          value={user.year.toString()}
        />
        <DetailRow
          icon={GitBranch}
          label="Branch"
          value={user.branch}
        />
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-border bg-muted/30">
        <Button
          onClick={() => setActiveView('delete')}
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span>Delete Account</span>
        </Button>
      </div>

      {/* Sign Out */}
      <div className="p-6 border-t border-border bg-muted/30">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Logged in to Silo
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
