export const convertLinksToClickable = (text: string) => {
  if (!text) return null;
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s<>"]+)/g;
  
  // Split text by URLs
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (part.match(urlRegex)) {
      // Validate URL to prevent javascript: and data: URIs
      try {
        const url = new URL(part);
        // Only allow http and https protocols
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {part}
            </a>
          );
        }
      } catch (e) {
        // Invalid URL, treat as text
      }
    }
    // React automatically escapes text content, preventing XSS
    return part;
  });
};