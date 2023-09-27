import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { uniqBy } from 'lodash';

import Logo from './Logo';
import { UserContext } from './context/UserContext';
import MessageBox from './MessageBox';
import axios from 'axios';
import Contact from './Contact';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  const bottomMessageRef = useRef(null);

  const { id } = useContext(UserContext);

  useEffect(() => {
    establishWebSocketonnection();
  }, []);

  const establishWebSocketonnection = () => {
    const ws = new WebSocket('ws://localhost:5000/');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        establishWebSocketonnection();
        console.log('Connection lost. Reconnecting...');
      }, 1000);
    });
  };

  const showOnlineUsers = (users) => {
    const onlineUsers = {};
    users.map(({ userId, username }) => (onlineUsers[userId] = username));
    setOnlineUsers(onlineUsers);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) showOnlineUsers(messageData.online);
    else setMessages((prev) => [...prev, { ...messageData }]);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText
      })
    );

    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now()
      }
    ]);
    setNewMessageText('');
  };

  useEffect(() => {
    const div = bottomMessageRef.current;
    if (div) div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    let allUsers = [];
    let offlineUsers = [];
    axios
      .get('/users')
      .then((res) => {
        allUsers = res.data;

        allUsers.forEach((user) => {
          if (!Object.keys(onlineUsers).includes(user._id))
            offlineUsers.push(user);
        });
        setOfflineUsers(offlineUsers);
        console.log({ offlineUsers });
        console.log({ total: allUsers.length });
      })
      .catch((e) => console.log(e));
  }, [onlineUsers]);

  useEffect(() => {
    axios
      .get(`/messages/${selectedUserId}`)
      .then((res) => setMessages(res.data))
      .catch((e) => console.log(e));
  }, [selectedUserId]);

  // show all online users except logged in user
  const onlineUsersExcludingLoggedInUser = { ...onlineUsers };
  delete onlineUsersExcludingLoggedInUser[id];

  const messagesWithoutDuplicates = uniqBy(messages, '_id');

  const isSender = useMemo(() => {
    return (message) => message.sender === id;
  }, [id]);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />

        {/* Online users */}
        {Object.keys(onlineUsersExcludingLoggedInUser).map((userId) => (
          <Contact
            key={userId}
            id={userId}
            username={onlineUsers[userId]}
            online={true}
            selected={selectedUserId === userId}
            setSelectedUserId={setSelectedUserId}
          />
        ))}

        {/* Offline users */}
        {offlineUsers.map(({ _id, username }) => (
          <Contact
            key={_id}
            id={_id}
            username={username}
            online={false}
            selected={selectedUserId === _id}
            setSelectedUserId={setSelectedUserId}
          />
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
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute inset-0">
                {messagesWithoutDuplicates.map((message) => (
                  <MessageBox
                    key={message._id}
                    message={message}
                    isSender={isSender(message)}
                  />
                ))}
                <div className="h-4" ref={bottomMessageRef} />
              </div>
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
