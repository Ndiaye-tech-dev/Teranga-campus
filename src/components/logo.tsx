import Image from "next/image";

export function Logo({
  className,
  variant = "full",
}: {
  className?: string;
  /** "full" : logo complet · "mark" : emblème seul, lisible en petit */
  variant?: "full" | "mark";
}) {
  if (variant === "mark") {
    return (
      <Image
        src="/logo-icon.png"
        alt="Teranga Campus"
        width={1024}
        height={1024}
        className={`h-full w-auto object-contain ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src="/logo.png"
      alt="Teranga Campus"
      width={2020}
      height={779}
      className={`h-full w-auto object-contain ${className ?? ""}`}
    />
  );
}
