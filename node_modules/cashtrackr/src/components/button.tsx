type ButtonVariant = "light" | "dark" | "danger" | "blue";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variants = {
  light: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
  dark: "bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-700",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-400",
  blue: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400",
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

function Button({
  variant = "light",
  size = "md",
  isLoading,
  disabled,
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} rounded-lg transition duration-200 ease-in-out disabled:cursor-not-allowed`}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
