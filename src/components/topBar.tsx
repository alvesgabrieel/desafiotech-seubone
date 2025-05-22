import Image from "next/image";

import mainLogo from "../../public/logo-login.png";

const TopBar = () => {
  return (
    <div className="flex h-16 items-center bg-[#440986]">
      <Image
        src={mainLogo}
        alt="Fanation Logo"
        width={120}
        height={40}
        className="ml-8"
      />
    </div>
  );
};

export default TopBar;
