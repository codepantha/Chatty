import axios from 'axios';
import React from 'react';
import { ImAttachment } from 'react-icons/im';

const MessageBox = ({ message, isSender }) => {
  return (
    <div className={isSender ? 'text-right' : 'text-left'}>
      <div
        className={`text-left inline-block p-2 my-2
                    md:max-w-[60%] max-w-[75%] rounded-md break-words ${
                      isSender ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
      >
        <p>{message.text && message.text}</p>
        {message.file && (
          <a
            target="_blank"
            className="flex items-center gap-1 border-b"
            href={`http://127.0.0.1:5000/uploads/${message.file}`}
          >
            <ImAttachment fontSize={24} />
            <p>{message.file}</p>
          </a>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
