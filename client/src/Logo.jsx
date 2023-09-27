import React from 'react';
import { HiOutlineChat } from 'react-icons/hi';

const Logo = () => {
  return (
    <div className="text-blue-600 font-bold flex gap-2 mb-4 p-4">
      <HiOutlineChat className="w-6 h-6" />
      <h3>Chatty</h3>
    </div>
  );
};

export default Logo;
