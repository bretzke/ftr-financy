import logo from "@/assets/logo.svg";

interface BrandProps {
  size: "small" | "medium";
}

export function Brand({ size = "medium" }: BrandProps) {
  const logoWidth = size === "medium" ? 134 : 100;
  const logoHeight = size === "medium" ? 32 : 24;

  return <img src={logo} alt="Financy" width={logoWidth} height={logoHeight} />;
}

