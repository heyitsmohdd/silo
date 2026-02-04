import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LogOut, Mail, Shield, Calendar, GitBranch, Edit2, Lock, User, Trash2 } from 'lucide-react';
import axiosClient from '@/lib/axios';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<'profile' | 'edit' | 'password' | 'delete'>('profile');

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
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email: user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    };

    try {
      await axiosClient.put('/auth/profile', formData);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      currentPassword: e.target.value,
      newPassword: '',
      confirmPassword: '',
    };

    try {
      await axiosClient.put('/auth/change-password', formData);
      window.location.reload();
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-lg shadow-soft-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md"
            >
              {user.firstName
                ? user.firstName[0]
                : user.userId[0]?.toUpperCase() || 'U'}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">
              {user.firstName
                ? `${user.firstName} ${user.lastName || ''}`
                : user.userId}
            </h1>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {user.role === 'STUDENT' ? 'Active Student' : 'Professor'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="bg-card border border-destructive/20 rounded-lg shadow-soft-lg p-6 mt-6">
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
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Default View - Profile Details */}
        {activeView === 'profile' && (
          <div className="bg-card border border-border rounded-lg shadow-soft-lg p-6">
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
              </div>

              {/* Role */}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                  </div>
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
              </div>

              {/* Branch */}
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Branch</p>
                    <p className="text-sm text-muted-foreground">{user.branch}</p>
                  </div>
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

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setActiveView('edit')}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setActiveView('password')}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Lock className="w-4 h-4" />
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
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
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
          Sign Out
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Logged in to Silo
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
