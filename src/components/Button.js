export default function Button({ children, onClick, className, title }) {
  <button
    onClick={onClick}
    className={
      className ||
      "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
    }
  >
    {title}
  </button>;
}
