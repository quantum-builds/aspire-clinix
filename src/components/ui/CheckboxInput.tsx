interface CheckboxInputProps {
  name: string;
  options: string[];
  selectedOption: string[];
  onChange: (value: string) => void;
  title?: string;
  description?: string;
}
export default function CheckboxInput({
  name,
  options,
  selectedOption,
  onChange,
  title,
  description,
}: CheckboxInputProps) {
  return (
    <div className="mt-20 font-opus">
      {title && <h3 className="text-[24px] font-normal">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-5 mt-8">
        {options.map((option) => (
          <div key={option} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedOption.includes(option)}
              onChange={() => onChange(option)}
              className="bg-[#ECE8E3] text-[#ECE8E3] form-radio h-[27px] w-[27px] border-[0.75px] border-[#000000] rounded-[5px]"
            />
            <label
              htmlFor={`${name}-${option}`}
              className="flex items-center space-x-5 text-[22px] font-normal ml-5"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
