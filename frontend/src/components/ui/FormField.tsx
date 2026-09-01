import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  icon: string; // ej: "bi-calendar"
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ label, icon, className, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label className="agregar-label">{label}</label>
      <div className="agregar-field-wrapper">
        <i className={`bi ${icon} agregar-icon-left`}></i>
        <input className={`agregar-input ${className ?? ""}`} {...inputProps} />
      </div>
    </div>
  );
}