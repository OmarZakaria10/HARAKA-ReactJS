export default function Button({ children, onClick, className, title }) {
  return (
    <button
      onClick={onClick}
      className={
        className ||
        "w-20 px-4 py-2 bg-blue-700 text-white rounded hover:bg-green-600 transition-colors text-sm"
      }
    >
      {title}
      {children}
    </button>
  );
}
