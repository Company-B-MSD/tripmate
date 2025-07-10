import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiLock } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function PasswordSection() {
  const { getAuthHeader } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      

      toast({
        title: 'Success!',
        description: 'Your password has been updated successfully.',
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Change Password</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmPassword', label: 'Confirm New Password' }
          ].map(({ key, label }) => (
            <div key={label} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            </div>
          ))}
          <Button type="submit">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}