interface RadioInputProps {
  name: string;
  options: string[];
  selectedOption: string[];
  onChange: (value: string) => void;
  title?: string;
  description?: string;
}
export default function RadioInput({
  name,
  options,
  selectedOption,
  onChange,
  title,
  description,
}: RadioInputProps) {
  return (
    <div className="mt-20 font-opus">
      <h2 className="text-[24px] font-normal">{title}</h2>
      <p className="text-[24px] font-normal">{description}</p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center space-x-5 text-[22px] font-normal"
          >
            <input
              type="checkbox"
              name={`${name}-${index}`}
              value={option}
              checked={selectedOption.includes(option)}
              onChange={() => onChange(option)}
              className="appearance-none bg-[#ECE8E3] text-[#ECE8E3] form-radio h-[27px] w-[27px] border-[0.75px] border-[#000000] rounded-[5px]"
            />
            <span className="">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
