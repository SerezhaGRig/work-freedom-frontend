export const Input: React.FC<{
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  minLength?: number;
  maxLength?: number;
}> = ({ label, type = 'text', value, onChange, placeholder, required, icon, minLength, maxLength }) => {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          minLength={minLength}
          maxLength={maxLength}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 bg-white hover:border-gray-400`}
        />
      </div>
    </div>
  );
};
