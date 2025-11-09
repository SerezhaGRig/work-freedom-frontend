// SearchFilters.tsx - Dynamic filters from API, shown only after search with results

'use client';

import { useState, useEffect, useRef } from 'react';
import { Filter, X, DollarSign, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SearchFilters as SearchFiltersType, AvailableFilters } from '@/lib/api/api-client';
import { useI18n } from '@/lib/i18n/i18n-context';
import { getDurationLabel } from '@/config/constants';

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFiltersType) => void;
  onClearFilters: () => void;
  activeFilters: SearchFiltersType;
  availableFilters?: AvailableFilters; // Dynamic filters from API
  showFilters: boolean; // Only show after search query
}

export function SearchFilters({ 
  onApplyFilters, 
  onClearFilters, 
  activeFilters,
  availableFilters,
  showFilters 
}: SearchFiltersProps) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(activeFilters);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Update local filters when active filters change
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    setIsExpanded(false);
  };

  const hasActiveFilters = Object.keys(activeFilters).some(
    key => activeFilters[key as keyof SearchFiltersType] !== undefined
  );

  const hasAvailableFilters = availableFilters && (
    (availableFilters.regions && availableFilters.regions.length > 0) ||
    (availableFilters.durations && availableFilters.durations.length > 0) ||
    (availableFilters.budgetTypes && availableFilters.budgetTypes.length > 0) ||
    availableFilters.minBudget !== undefined
  );

  // Don't show filters if no search query or no available filters
  if (!showFilters || !hasAvailableFilters) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant={isExpanded ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters ? t('searchFilters.filtersActive') : t('searchFilters.refineResults')}
          {hasActiveFilters && (
            <Badge>
              {Object.keys(activeFilters).length}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && !isExpanded && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
            {t('common.clearFilters')}
          </Button>
        )}
      </div>

      {isExpanded && (
        <Card className="p-6 space-y-6">
          {/* Region Filter - Only if available from API */}
          {availableFilters?.regions && availableFilters.regions.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                <h3 className="font-semibold text-gray-800">{t('posts.region')}</h3>
              </div>
              <select
                value={localFilters.region || ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  region: e.target.value || undefined
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('searchFilters.allRegions')}</option>
                {availableFilters.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duration Filter - Only if available from API */}
          {availableFilters?.durations && availableFilters.durations.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <Clock className="w-4 h-4 mr-2 text-gray-600" />
                <h3 className="font-semibold text-gray-800">{t('posts.projectDuration')}</h3>
              </div>
              <select
                value={localFilters.duration || ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  duration: e.target.value as any || undefined
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('searchFilters.allDurations')}</option>
                {availableFilters.durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {getDurationLabel(duration, t)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Budget Filter - Only if available from API */}
          {(availableFilters?.budgetTypes || availableFilters?.minBudget !== undefined) && (
            <div>
              <div className="flex items-center mb-3">
                <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                <h3 className="font-semibold text-gray-800">{t('posts.budget')}</h3>
              </div>
              
              <div className="space-y-4">
                {/* Budget Type - Only if available */}
                {availableFilters?.budgetTypes && availableFilters.budgetTypes.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">{t('posts.budgetType')}</label>
                    <div className="flex gap-2">
                      {availableFilters.budgetTypes.includes('hourly') && (
                        <Button
                          variant={localFilters.budgetType === 'hourly' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setLocalFilters({
                            ...localFilters,
                            budgetType: localFilters.budgetType === 'hourly' ? undefined : 'hourly'
                          })}
                        >
                          {t('posts.hourly')}
                        </Button>
                      )}
                      {availableFilters.budgetTypes.includes('fixed') && (
                        <Button
                          variant={localFilters.budgetType === 'fixed' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setLocalFilters({
                            ...localFilters,
                            budgetType: localFilters.budgetType === 'fixed' ? undefined : 'fixed'
                          })}
                        >
                          {t('posts.fixed')}
                        </Button>
                      )}
                      {availableFilters.budgetTypes.includes('monthly') && (
                        <Button
                          variant={localFilters.budgetType === 'monthly' ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setLocalFilters({
                            ...localFilters,
                            budgetType: localFilters.budgetType === 'monthly' ? undefined : 'monthly'
                          })}
                        >
                          {t('posts.monthly')}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Budget Range - Only if min/max available */}
                {availableFilters?.minBudget !== undefined && availableFilters?.maxBudget !== undefined && (
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      {t('searchFilters.budgetRange')}: ${availableFilters.minBudget} - ${availableFilters.maxBudget}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          label={t('searchFilters.minBudget')}
                          type="number"
                          value={`${localFilters.minBudget}` || ''}
                          onChange={(e) => setLocalFilters({
                            ...localFilters,
                            minBudget: e.target.value ? Number(e.target.value) : undefined
                          })}
                          placeholder={availableFilters.minBudget.toString()}
                        />
                      </div>
                      <div>
                        <Input
                          label={t('searchFilters.maxBudget')}
                          type="number"
                          value={`${localFilters.maxBudget}` || ''}
                          onChange={(e) => setLocalFilters({
                            ...localFilters,
                            maxBudget: e.target.value ? Number(e.target.value) : undefined
                          })}
                          placeholder={availableFilters.maxBudget.toString()}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleClear}
            >
              {t('common.clearFilters')}
            </Button>
            <Button
              onClick={handleApply}
            >
              {t('searchFilters.applyFilters')}
            </Button>
          </div>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {localFilters.region && (
            <Badge>
              <MapPin className="w-3 h-3 mr-1" />
              {localFilters.region}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters, region: undefined };
                  setLocalFilters(newFilters);
                  onApplyFilters(newFilters);
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.duration && (
            <Badge>
              <Clock className="w-3 h-3 mr-1" />
              {getDurationLabel(localFilters.duration, t)}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters, duration: undefined };
                  setLocalFilters(newFilters);
                  onApplyFilters(newFilters);
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.budgetType && (
            <Badge>
              {localFilters.budgetType} {t('searchFilters.rate')}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters, budgetType: undefined };
                  setLocalFilters(newFilters);
                  onApplyFilters(newFilters);
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(localFilters.minBudget || localFilters.maxBudget) && (
            <Badge>
              ${localFilters.minBudget || availableFilters?.minBudget || 0} - ${localFilters.maxBudget || availableFilters?.maxBudget || '∞'}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters, minBudget: undefined, maxBudget: undefined };
                  setLocalFilters(newFilters);
                  onApplyFilters(newFilters);
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}