'use client';

import { useState, useEffect } from 'react';
import { Plus, UserRoundIcon, X } from 'lucide-react';
import { User, Contact } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { apiService } from '@/lib/api/api-client';
import { useI18n } from '@/lib/i18n/i18n-context';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { setUser } = useAuthStore();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactType, setNewContactType] = useState<Contact['type']>('phone');
  const [newContactValue, setNewContactValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSurname(user.surname || '');
      setAboutMe(user.aboutMe || '');
      setContacts(user.contacts);
    }
  }, [user]);

  const addContact = () => {
    if (!newContactValue.trim()) return;

    const newContact: Contact = {
      type: newContactType,
      value: newContactValue,
      show: true,
    };

    setContacts([...contacts, newContact]);
    setNewContactValue('');
    setShowAddContact(false);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const toggleContactVisibility = (index: number) => {
    setContacts(
      contacts.map((contact, i) =>
        i === index ? { ...contact, show: !contact.show } : contact
      )
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...user,
        name,
        surname,
        aboutMe,
        contacts,
      };
      
      await apiService.editUserProfile({
        name,
        surname,
        aboutMe,
        contacts,
      });
      
      setUser(updatedUser);
      alert(t('profile.updateSuccess'));
      onClose();
    } catch (error) {
      alert(t('profile.updateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('profile.editProfile')}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <Input
          label={t('profile.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John"
          required
        />

        <Input
          label={t('profile.surname')}
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Doe"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('profile.bio')}
          </label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder={t('profile.bioPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="mt-1 text-right">
            <span className="text-xs text-gray-500">
              {aboutMe.length}/500 {t('profile.characters')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              {t('profile.contactMethods')}
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowAddContact(!showAddContact)}
            >
              <Plus className="w-4 h-4" /> {t('common.add')}
            </Button>
          </div>

          {showAddContact && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <select
                value={newContactType}
                onChange={(e) => setNewContactType(e.target.value as Contact['type'])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="phone">{t('profile.contactTypes.phone')}</option>
                <option value="whatsapp">{t('profile.contactTypes.whatsapp')}</option>
                <option value="viber">{t('profile.contactTypes.viber')}</option>
                <option value="web">{t('profile.contactTypes.website')}</option>
                <option value="email">{t('profile.contactTypes.email')}</option>
              </select>
              
              <Input
                value={newContactValue}
                onChange={(e) => setNewContactValue(e.target.value)}
                placeholder={t('profile.enterContact')}
              />
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={addContact}
                  className="flex-1"
                >
                  {t('common.add')}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContactValue('');
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Badge variant="default">{contact.type}</Badge>
                  <span className="text-sm text-gray-800 truncate">
                    {contact.value}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleContactVisibility(index)}
                    className={`text-xs px-2 py-1 rounded ${
                      contact.show
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {contact.show ? t('profile.visible') : t('profile.hidden')}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t('profile.saving') : t('profile.saveChanges')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}