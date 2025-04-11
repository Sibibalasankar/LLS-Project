const Card = ({ children, className = '' }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};

export { Card, CardContent };
