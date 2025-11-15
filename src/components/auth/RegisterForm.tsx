'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Users, Plus, X, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { Contact } from '@/types';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContactType, setNewContactType] = useState<Contact['type']>('phone');
  const [newContactValue, setNewContactValue] = useState('');
  
  const { register, isLoading, error } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const addContact = () => {
    if (!newContactValue) return;
    
    const newContact: Contact = {
      type: newContactType,
      value: newContactValue,
      show: true,
    };
    
    setContacts([...contacts, newContact]);
    setNewContactValue('');
    setShowContactModal(false);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email, password, name, surname, contacts });
  };

  return (
    <>
      <Card className="w-full max-w-md p-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{t('auth.createAccount')}</h1>
          <p className="text-gray-600 mt-2">{t('auth.joinPlatform')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            icon={<Mail className="w-5 h-5" />}
          />
          
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.minCharacters')}
            required
          />
          
          <Input
            label={t('auth.firstName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
            required
          />
          
          <Input
            label={t('auth.lastName')}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Doe"
          />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">{t('auth.contacts')}</label>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowContactModal(true)}
              >
                <Plus className="w-4 h-4" /> {t('common.add')}
              </Button>
            </div>
            
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm">
                  <Badge>{t(`auth.${contact.type}`)}</Badge> {contact.value}
                </span>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>
        </form>
        
        <div className="mt-6 space-y-3 text-center">
          <p className="text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {t('auth.signIn')}
            </button>
          </p>
          
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => router.push('/posts')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 
                        border border-gray-300 rounded-lg text-gray-700 
                        bg-gray-50
                        hover:bg-white-80 font-semibold transition"
            >
              <FileText className="w-4 h-4" />
              {t('nav.browseJobsWithout')}
            </button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title={t('auth.addContact')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.contactType')}
            </label>
            <select
              value={newContactType}
              onChange={(e) => setNewContactType(e.target.value as Contact['type'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="phone">{t('auth.phone')}</option>
              <option value="whatsapp">{t('auth.whatsapp')}</option>
              <option value="viber">{t('auth.viber')}</option>
              <option value="web">{t('auth.website')}</option>
              <option value="email">{t('auth.email')}</option>
            </select>
          </div>
          
          <Input
            label={t('auth.contactValue')}
            value={newContactValue}
            onChange={(e) => setNewContactValue(e.target.value)}
            placeholder={t('auth.enterContactInfo')}
            required
          />
          
          <Button onClick={addContact} className="w-full">
            {t('auth.addContact')}
          </Button>
        </div>
      </Modal>
    </>
  );
}