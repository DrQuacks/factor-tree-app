import Image from 'next/image';

const NavBar = () => {
  return (
    <div className="relative w-full flex items-center justify-between px-6 py-3 border-b border-gray-200" style={{ backgroundColor: '#FCF9F2' }}>
      <div className="absolute top-3 left-3">
        <Image 
          src="/images/main.png" 
          alt="Logo" 
          width={300} 
          height={300} 
          className="object-contain"
        />
      </div>
      <div className="flex gap-4 ml-auto">
        <button className="px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Login</button>
        <button className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">Sign Up</button>
      </div>
    </div>
  );
};

export default NavBar;