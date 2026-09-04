import Image from "next/image";

export function Logo({ className }: { className?: string }) {
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