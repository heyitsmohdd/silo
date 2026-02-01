import { useState, type FormEvent } from 'react';
import { Lock, Save, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axiosClient from '@/lib/axios';

interface ChangePasswordProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ChangePassword = ({ onCancel, onSuccess }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Global Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {/* Current Password */}
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          required
          disabled={isLoading}
        />

        {/* New Password */}
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          required
          disabled={isLoading}
        />

        {/* Password Requirements */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-card-foreground">
            Password Requirements:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Minimum 8 characters</li>
            <li>• Should be different from current password</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
