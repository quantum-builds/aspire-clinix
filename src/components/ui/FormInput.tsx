import React from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";
interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  className?: string;
}
const FormInput = <T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  type,
  className,
}: FormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <div style={{ marginBottom: "1rem" }} className={className}>
      <label
        htmlFor={name}
        style={{ display: "block", marginBottom: "0.5rem" }}
        className="text-[24px] my-10 font-opus"
      >
        {label}
      </label>
      <input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: error ? "1px solid red" : "1px solid #000000",
          borderRadius: "10px",
        }}
        className="bg-[#ECE8E3] font-opus"
      />
      {error && (
        <span style={{ color: "red", fontSize: "0.875rem" }}>
          {error.message}
        </span>
      )}
    </div>
  );
};
export default FormInput;
