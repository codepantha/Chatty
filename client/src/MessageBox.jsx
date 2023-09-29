import axios from 'axios';
import React, { useMemo } from 'react';
import { HiOutlineDocument } from 'react-icons/hi2';
import { ImAttachment } from 'react-icons/im';

const MessageBox = ({ message, isSender }) => {
  const filePath = `http://127.0.0.1:5000/uploads/${message.file}`;

  const getFileType = () => {
    return message.file?.split('.').pop().toLowerCase();
  };

  const isAudioFile = () => {
    return ['mp3', 'ogg', 'wav', 'flac'].includes(getFileType());
  };

  const isVideoFile = () => {
    return ['mp4', '3gp', 'avi', 'webm'].includes(getFileType());
  };

  const isImageFile = () => {
    return ['jpg', 'jpeg', 'png', 'gif'].includes(getFileType());
  };

  return (
    <div className={isSender ? 'text-right' : 'text-left'}>
      {message.text && (
        <div
          className={`text-left inline-block p-2 my-2
                    md:max-w-[60%] max-w-[75%] rounded-md break-words ${
                      isSender ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      {message.file && (
        <div
          className={`text-left inline-block p-2 my-2
                    md:max-w-[60%] max-w-[75%] rounded-md`}
        >
          {isImageFile() ? (
            <div className="lg:w-[250px]">
              <img
                className="object-contain rounded-md"
                src={filePath}
                alt="image-file"
              />
            </div>
          ) : isAudioFile() ? (
            <audio src={filePath} controls />
          ) : isVideoFile() ? (
            <video src={filePath} controls />
          ) : (
            <a
              className={`text-left p-2 my-2
             rounded-md break-words flex ${
               isSender ? 'bg-blue-600 text-white' : 'bg-white'
             }`}
              href={filePath}
            >
              <HiOutlineDocument fontSize={24} />
              <p className="border-b border-gray-400">{message.file}</p>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
