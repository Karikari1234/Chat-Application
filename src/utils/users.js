const users = [];

//addUser

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username or room not found",
    };
  }

  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//GetUser
const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

//getUsers in a room
const getRoomUsers = (room) => {
  room = room.trim().toLowerCase();
  const userList = users.filter((user) => user.room === room);
  return userList;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
};
