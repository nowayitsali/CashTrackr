type theme = "light" | "dark";
type inputSize = "sm" | "md" | "lg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  theme?: theme;
  inputSize?: inputSize;
}

const themes = {
  light: "bg-white text-gray-800 placeholder-gray-400 border-black/20",
  dark: "bg-[#08090C] text-white placeholder-white/20 border-white/20",
};

const sizes = {
  sm: "p-2 h-[40px]",
  md: "p-4 h-[40px]",
  lg: "p-6 h-[40px]",
};

function Input({
  className = "",
  theme = "dark",
  inputSize = "md",
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      className={`w-full rounded-xl border  ${themes[theme]} ${sizes[inputSize]} ${className || ""}`}
      {...props}
    />
  );
}

export default Input;
