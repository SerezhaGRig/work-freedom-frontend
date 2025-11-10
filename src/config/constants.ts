export const REGIONS =  [
  'Yerevan', 
  'Remote', 
  'Gyumri',
  'Other'
];

export const POLLING_INTERVAL = 5000;
export const LOCALE_KEY = 'app-locale';

export const getDurationLabel = (duration: string, t: any) => {
  const labels: Record<string, string> = {
    'less_than_month': t('posts.duration.lessThanMonth'),
    'less_than_3_months': t('posts.duration.lessThan3Months'),
    'more_than_3_months': t('posts.duration.moreThan3Months')
  };
  return labels[duration] || duration;
};


export const API_URL = 'https://ag1lcrnsga.execute-api.us-east-1.amazonaws.com/dev/api'
