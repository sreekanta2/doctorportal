import { siteConfig } from "@/config/site";
import Image from "next/image";

export default function SiteLogo(className?: any) {
  return (
    <Image
      src={siteConfig.logo || "@/assets/logo.png"}
      className={className}
      width={50}
      height={50}
      alt="logo"
    />
  );
}
