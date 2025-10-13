'use client';

import { Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import { Contact } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '../ui/Badge';

interface ContactsDisplayProps {
  contacts: Contact[];
  title?: string;
}

export function ContactsDisplay({
  contacts,
  title = 'Contact Information',
}: ContactsDisplayProps) {
  const getIcon = (type: Contact['type']) => {
    switch (type) {
      case 'phone':
        return Phone;
      case 'email':
        return Mail;
      case 'web':
        return Globe;
      case 'whatsapp':
      case 'viber':
        return MessageCircle;
      default:
        return Phone;
    }
  };

  const getContactLink = (contact: Contact) => {
    switch (contact.type) {
      case 'phone':
        return `tel:${contact.value}`;
      case 'email':
        return `mailto:${contact.value}`;
      case 'web':
        return contact.value.startsWith('http')
          ? contact.value
          : `https://${contact.value}`;
      case 'whatsapp':
        return `https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`;
      case 'viber':
        return `viber://chat?number=${contact.value.replace(/[^0-9]/g, '')}`;
      default:
        return '#';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>

      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No contacts shared yet
        </p>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, index) => {
            const Icon = getIcon(contact.type);
            const link = getContactLink(contact);

            return (
              <a
                key={index}
                href={link}
                target={contact.type === 'web' ? '_blank' : undefined}
                rel={
                  contact.type === 'web' ? 'noopener noreferrer' : undefined
                }
                className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="default">
                    {contact.type}
                  </Badge>
                  <p className="text-sm text-gray-800 break-all">
                    {contact.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </Card>
  );
}
