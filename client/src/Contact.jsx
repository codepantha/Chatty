import Avatar from './Avatar';

const Contact = ({
  id,
  username,
  online = false,
  selected,
  setSelectedUserId
}) => {
  return (
    <div
      key={id}
      onClick={() => setSelectedUserId(id)}
      className={`border-b border-gray-100 flex items-center
            gap-2 cursor-pointer ${
              selected && 'bg-blue-50 transition-all shadow-sm'
            }`}
    >
      {selected && (
        <div className="w-1 h-12 bg-blue-500 rounded-r-md" />
      )}
      <div className="flex gap-2 items-center py-2 px-4">
        <Avatar online={online} userId={id} username={username} />
        <p className="text-gray-800 font-medium">{username}</p>
      </div>
    </div>
  );
};

export default Contact;
