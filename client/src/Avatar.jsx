import React from 'react';

const Avatar = ({ userId, username, online }) => {
  const generateBG = () => {
    const colors = [
      'bg-red-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-gray-200',
      'bg-purple-200',
      'bg-lime-200',
      'bg-emerald-200'
    ];
    return colors[parseInt(userId, 10) % colors.length];
  };

  return (
    <div
      className={`w-8 h-8 rounded-full ${generateBG()}
      flex justify-center items-center font-bold relative`}
    >
      <p className="text-lg opacity-70">{username[0]}</p>
      {online && (
        <div
          className="absolute w-3 h-3 bg-green-600
        bottom-0 right-0 rounded-full border-white border"
        />
      )}
    </div>
  );
};

export default Avatar;
