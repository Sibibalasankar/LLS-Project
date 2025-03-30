const Table = ({ children, className }) => (
    <table className={`w-full border-collapse ${className}`}>{children}</table>
  );
  
  const TableHeader = ({ children }) => <thead className="bg-gray-200">{children}</thead>;
  
  const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;
  
  const TableHead = ({ children }) => <th className="p-2 text-left">{children}</th>;
  
  const TableBody = ({ children }) => <tbody>{children}</tbody>;
  
  const TableCell = ({ children }) => <td className="p-2">{children}</td>;
  
  export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };
  