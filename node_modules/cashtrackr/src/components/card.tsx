type theme = "light" | "dark" | "navy";
type size = "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: theme;
  size?: size;
}

const themes = {
  light: "bg-white text-gray-800 border border-gray-500/40",
  dark: "bg-[#08090C] text-white border border-gray-300/20",
  navy: "bg-[#151821] text-white",
};

const sizes = {
  sm: "p-8 h-[200px]",
  md: "p-8 h-[400px]",
  lg: "p-8 h-[600px]",
};

function Card({
  theme = "light",
  size = "md",
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 ${themes[theme]} ${sizes[size]} rounded-3xl text-center ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
