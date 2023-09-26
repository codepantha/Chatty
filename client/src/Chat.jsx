import React, { useEffect, useState } from 'react';
import { HiOutlineChat } from 'react-icons/hi';
import Avatar from './Avatar';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
  }, []);

  const showOnlineUsers = (users) => {
    const onlineUsers = {};
    users.online.map(
      ({ userId, username }) => (onlineUsers[userId] = username)
    );
    setOnlineUsers(onlineUsers);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) showOnlineUsers(messageData);
  };

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <div className="text-blue-600 font-bold flex gap-2 mb-4 p-4">
          <HiOutlineChat className="w-6 h-6" />
          <h3>Chatty</h3>
        </div>
        {Object.keys(onlineUsers).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={`border-b border-gray-100 py-2 px-4 flex items-center
            gap-2 cursor-pointer ${selectedUserId === userId && 'bg-blue-50 transition-all shadow-sm'}`}
          >
            <Avatar userId={userId} username={onlineUsers[userId]} />
            <p className="text-gray-800 font-medium">{onlineUsers[userId]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-100 w-2/3 p-2">
        <div className="flex-1">Messages with selected contact</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Start typing..."
            className="bg-white flex-grow border rounded-sm p-2"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
