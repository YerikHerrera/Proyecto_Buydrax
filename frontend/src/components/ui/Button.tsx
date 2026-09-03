type ButtonProps = {
  text: string;
  onClick?: () => void;
  icon?: string;
  variant?: "primario" | "secundario";
  type?: "button" | "submit";
};

function Button({ text, onClick, icon, variant = "primario", type = "button" }: ButtonProps) {
  return (
    <button type={type} className={`agregar-btn-${variant}`} onClick={onClick}>
      {icon && <i className={`bi ${icon}`}></i>} {text}
    </button>
  );
}

export default Button;