import Image from "next/image";

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
          <div>
           <Image src="/logo.png" alt="LandRegistry Logo" width={200} height={200}/>
            <p className="text-sm text-gray-300">
              Access Official Land Registry Records Online
            </p>
          </div>
        </div>
      </header>
    );
  }
  