import React, { useContext, useEffect, useState } from 'react';
import { uniqBy } from 'lodash';

import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './context/UserContext';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const { id } = useContext(UserContext);

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
    else setMessages((prev) => [...prev, { ...messageData, isOurs: false }])
  };

  const sendMessage = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText
      })
    );

    setMessages((prev) => [...prev, { text: newMessageText, sender: id, recipient: selectedUserId, isOurs: true }]);
    setNewMessageText('');
  };

  // show all online users except logged in user
  const onlineUsersExcludingLoggedInUser = { ...onlineUsers };
  delete onlineUsersExcludingLoggedInUser[id];

  const messagesWithoutDuplicates = uniqBy(messages, 'id');

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlineUsersExcludingLoggedInUser).map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={`border-b border-gray-100 flex items-center
            gap-2 cursor-pointer ${
              selectedUserId === userId && 'bg-blue-50 transition-all shadow-sm'
            }`}
          >
            {selectedUserId === userId && (
              <div className="w-1 h-12 bg-blue-500 rounded-r-md" />
            )}
            <div className="flex gap-2 items-center py-2 px-4">
              <Avatar userId={userId} username={onlineUsers[userId]} />
              <p className="text-gray-800 font-medium">{onlineUsers[userId]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-100 w-2/3 p-2">
        <div className="flex-1">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <p className="text-gray-400 font-semibold">
                &larr; Select a chat from the sidebar
              </p>
            </div>
          )}

          {selectedUserId && (
            <div>
              {messagesWithoutDuplicates.map(message => (
                <div>{message.text}</div>
              ))}
            </div>
          )}
        </div>
        {selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              type="text"
              placeholder="Start typing..."
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
