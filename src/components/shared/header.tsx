import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
      <header className="bg-black text-white py-4">
        <div className="container mx-auto flex items-center space-x-4 px-6">
          {/* Logo */}
          {/* <img
            src="/logo.png" // Replace with actual image path
            alt="LandRegistry Logo"
            className="h-10 w-10"
          /> */}
          {/* Text Content */}
          <Link href="/">
           <Image src="/logo.png" alt="LandRegistry Logo" width={200} height={200}/>
            <p className="md:text-[18px] text-[14px] md:leading-[30px] leading-[20px] text-white font-medium mt-2">
              Access Official Land Registry Records Online
            </p>
          </Link>
        </div>
      </header>
    );
  }
  