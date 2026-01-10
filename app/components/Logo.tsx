import { Bot, Pill } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
}

export function Logo({ size = "md", showText = true, animated = false }: LogoProps) {
  const sizeClasses = {
    sm: { container: "w-12 h-12", icon: "w-6 h-6", pill: "w-4 h-4", text: "text-lg" },
    md: { container: "w-20 h-20", icon: "w-10 h-10", pill: "w-6 h-6", text: "text-2xl" },
    lg: { container: "w-32 h-32", icon: "w-16 h-16", pill: "w-10 h-10", text: "text-4xl" },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Logo Icon */}
      <div className={`relative ${s.container} ${animated ? "animate-float" : ""}`}>
        {/* Main Robot Circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg flex items-center justify-center">
          <Bot className={`${s.icon} text-white`} strokeWidth={2} />
        </div>
        
        {/* Pill Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full p-2 shadow-md border-2 border-white">
          <Pill className={`${s.pill} text-white`} strokeWidth={2.5} />
        </div>

        {/* Pulse Effect */}
        {animated && (
          <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />
        )}
      </div>

      {/* App Name */}
      {showText && (
        <div className="text-center">
          <h1 className={`${s.text} font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent`}>
            MediGo
          </h1>
          <p className="text-xs text-gray-600 font-medium">Smart prescriptions. Safer care.</p>
        </div>
      )}
    </div>
  );
}
