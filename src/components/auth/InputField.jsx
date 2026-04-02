export default function InputField({ label, helperText, error, id, ...props }) {
  return (
    <div className="w-full text-left">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}
