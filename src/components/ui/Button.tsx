export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: (() => void) | ((e: React.MouseEvent) => void);
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '' }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg';
  [{
	"resource": "/home/seroj/webstormProjects/work-freedom-frontend/src/components/posts/PostCard.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '(e: React.MouseEvent) => void' is not assignable to type '() => void'.\n  Target signature provides too few arguments. Expected 1 or more, but got 0.",
	"source": "ts",
	"startLineNumber": 89,
	"startColumn": 15,
	"endLineNumber": 89,
	"endColumn": 22,
	"relatedInformation": [
		{
			"startLineNumber": 3,
			"startColumn": 3,
			"endLineNumber": 3,
			"endColumn": 10,
			"message": "The expected type comes from property 'onClick' which is declared here on type 'IntrinsicAttributes & { children: ReactNode; onClick?: (() => void) | undefined; variant?: \"primary\" | \"secondary\" | \"danger\" | \"success\" | undefined; size?: \"sm\" | ... 2 more ... | undefined; disabled?: boolean | undefined; className?: string | undefined; }'",
			"resource": "/home/seroj/webstormProjects/work-freedom-frontend/src/components/ui/Button.tsx"
		}
	],
	"origin": "extHost2"
}]
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};