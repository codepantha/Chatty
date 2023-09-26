import React from 'react';

const MessageBox = ({ message, isSender }) => {
  return (
    <div className={isSender ? 'text-right' : 'text-left'}>
      <p
        className={`text-left inline-block p-2 my-2
                    md:max-w-[60%] max-w-[75%] rounded-md break-words ${
                      isSender ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
      >
        {message.text}
      </p>
    </div>
  );
};

export default MessageBox;
