export const Card: React.FC<{ children: React.ReactNode; className?: string,   onClick?: (() => void) | ((e: React.MouseEvent) => void);
  }> = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    onClick ={onClick}
    >
      {children}
    </div>
  );
};