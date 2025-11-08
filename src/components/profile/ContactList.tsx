'use client';

import { Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import { Contact } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '../ui/Badge';
import { useI18n } from '@/lib/i18n/i18n-context';

interface ContactsListProps {
  contacts: Contact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  const { t } = useI18n();
  
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

  const getContactTypeLabel = (type: Contact['type']) => {
    const typeMap: Record<Contact['type'], string> = {
      phone: t('profile.contactTypes.phone'),
      email: t('profile.contactTypes.email'),
      web: t('profile.contactTypes.website'),
      whatsapp: t('profile.contactTypes.whatsapp'),
      viber: t('profile.contactTypes.viber'),
    };
    return typeMap[type] || type;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t('profile.contactMethods')}
      </h2>
      
      {contacts.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          {t('profile.noContactsYet')}
        </p>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, index) => {
            const Icon = getIcon(contact.type);
            return (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="default">
                      {getContactTypeLabel(contact.type)}
                    </Badge>
                    {contact.show && (
                      <span className="text-xs text-green-600">
                        {t('profile.visible')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 break-all">
                    {contact.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}