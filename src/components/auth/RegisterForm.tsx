'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Users, Plus, X, Badge } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/hooks/useAuth';
import { Contact } from '@/types';
import { Button } from '../ui/Button';

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our job platform today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            icon={<Mail className="w-5 h-5" />}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
          
          <Input
            label="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
            required
          />
          
          <Input
            label="Last Name"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Doe"
          />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Contacts</label>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowContactModal(true)}
              >
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
            
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm">
                  <Badge>{contact.type}</Badge> {contact.value}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>

      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Add Contact"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Type
            </label>
            <select
              value={newContactType}
              onChange={(e) => setNewContactType(e.target.value as Contact['type'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="viber">Viber</option>
              <option value="web">Website</option>
              <option value="email">Email</option>
            </select>
          </div>
          
          <Input
            label="Contact Value"
            value={newContactValue}
            onChange={(e) => setNewContactValue(e.target.value)}
            placeholder="Enter contact information"
            required
          />
          
          <Button onClick={addContact} className="w-full">
            Add Contact
          </Button>
        </div>
      </Modal>
    </>
  );
}