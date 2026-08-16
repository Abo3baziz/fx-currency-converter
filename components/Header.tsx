import Image from "next/image";
import Logo from "@/public/images/logo.svg";
import { flags } from "@/assets/data/flags";

export default function Header() {
  return (
    <header className="p-200 flex justify-between items-center">
      <Image
        src={Logo}
        alt="FX Logo"
        className="max-mobile:w-25 w-37.5"
        loading="eager"></Image>

      <p className="text-header-text-color max-mobile:text-[10px]">
        {flags.length} CURRENCIES · EOD · ECB DATA
      </p>
    </header>
  );
}