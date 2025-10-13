'use client';

import { useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { useAuthStore } from '@/lib/store/authStore';
import { ContactsList } from '@/components/profile/ContactList';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader user={user} onEdit={() => setShowEditModal(true)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ProfileInfo user={user} />
        </div>
        <div>
          <ContactsList contacts={user.contacts} />
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />
    </div>
  );
}