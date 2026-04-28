type theme = "light" | "dark" | "navy";
type size = "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: theme;
  size?: size;
}

const themes = {
  light: "bg-white text-gray-800",
  dark: "bg-[#08090C] text-white",
  navy: "bg-[#151821] text-white",
};

const sizes = {
  sm: "p-4",
  md: "p-8",
  lg: "p-12",
};

function Card({
  theme = "light",
  size = "md",
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`flex flex-col gap-4 ${themes[theme]} ${sizes[size]} rounded-lg shadow-lg text-center ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
