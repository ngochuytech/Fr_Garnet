/**
 * Shared Input component with label, error state, icon support.
 */
const Input = ({
  id,
  label,
  error,
  icon: Icon,
  rightElement,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={17} />
          </span>
        )}
        <input
          id={id}
          className={`
            w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800
            placeholder:text-slate-400
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:border-transparent
            ${Icon ? 'pl-9' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${error
              ? 'border-red-300 focus:ring-red-200'
              : 'border-slate-200 hover:border-slate-300 focus:ring-[rgba(176,79,81,0.2)] focus:border-[#b04f51]'
            }
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
