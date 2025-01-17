// StatusDropdown.jsx
import React from 'react';
import PropTypes from 'prop-types';

const StatusDropdown = ({
  item,
  onStatusChange,
  isUpdating,
  disabled = false,
  statusField = 'status',
  idField = 'id',
  options = [
    { value: 'pending', label: 'Pendiente', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { value: 'in_progress', label: 'En tramitación', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'completed', label: 'Finalizado', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'spam', label: 'Spam', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ],
  width = 'w-32',
  viewOnly = false
}) => {
  const getStatusColors = (status) => {
    const option = options.find(opt => opt.value === status);
    return option ? `${option.bgColor} ${option.textColor}` : '';
  };

  const getCurrentLabel = () => {
    const option = options.find(opt => opt.value === item[statusField]);
    return option ? option.label : '';
  };

  const isDisabled = disabled || isUpdating === item[idField];

  if (viewOnly) {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-semibold ${getStatusColors(item[statusField])}`}>
        {getCurrentLabel()}
      </span>
    );
  }

  return (
    <div className={`relative inline-block ${width}`}>
      <select
        value={item[statusField]}
        onChange={(e) => onStatusChange(item[idField], e.target.value)}
        disabled={isDisabled}
        className={`w-full px-2 py-1 text-xs rounded-full font-semibold border-0
          appearance-none select-none
          focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500
          transition-opacity duration-200
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
          ${getStatusColors(item[statusField])}
        `}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          backgroundImage: 'none'
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
        {isUpdating === item[idField] ? (
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
};

StatusDropdown.propTypes = {
  item: PropTypes.object.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  isUpdating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  statusField: PropTypes.string,
  idField: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      bgColor: PropTypes.string.isRequired,
      textColor: PropTypes.string.isRequired
    })
  ),
  width: PropTypes.string,
  viewOnly: PropTypes.bool
};

export default StatusDropdown;
