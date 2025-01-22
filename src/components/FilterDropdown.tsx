import React from "react";

interface FilterDropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selected,
  onChange,
}) => (
  <select value={selected} onChange={(e) => onChange(e.target.value)}>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default FilterDropdown;
