import React from "react";
import { useController, Control, FieldValues, Path } from "react-hook-form";
interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control?: Control<T>;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  className?: string;
  backgroundColor: string;
  marginTop: string;
  inputMarginTop?: string;
  padding?: string;
  labelTextSize?: string;
}
const FormInput = <T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  type,
  className,
  backgroundColor,
  marginTop,
  inputMarginTop,
  padding,
  labelTextSize,
}: FormInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <div className={className} style={{ marginTop: `${marginTop}` }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: `${labelTextSize}`,
        }}
        className="w-1/3 text-[16px] md:text-[24px] font-normal font-opus text-nowrap pb-3"
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
          border: error ? "1px solid red" : "1px solid #000000",
          borderRadius: "10px",
          backgroundColor: `${backgroundColor}`,
          marginTop: `${inputMarginTop}`,
          padding: `${padding}`,
        }}
        className="font-opus px-3 outline-none flex-1 "
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
