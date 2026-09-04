type ButtonProps = {
  text: string;
  onClick?: () => void;
  icon?: string;
  variant?: "primario" | "secundario";
  type?: "button" | "submit";
  disabled?: boolean;
};

function Button({ text, onClick, icon, variant = "primario", type = "button", disabled = false }: ButtonProps) {
  return (
    <button type={type} className={`agregar-btn-${variant}`} onClick={onClick} disabled={disabled}>
      {icon && <i className={`bi ${icon}`}></i>} {text}
    </button>
  );
}

export default Button;