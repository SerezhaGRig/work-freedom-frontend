import { Share2 } from "lucide-react";

export const Share: React.FC<{
  title: string;
  description: string;
  shareUrl: string;
  disableCopy?: boolean
  shorten?: boolean
}> = ({ title, description, shareUrl, disableCopy , shorten}) => {
      const handleShare = async () => {

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description.substring(0, 100) + '...' || 'Check out this job post',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4 mr-1" />
              {!shorten && 'Share'}
            </button>
            {!disableCopy && <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Copy Link
            </button>}
          </div>
  );
};