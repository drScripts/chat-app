const moment = require("moment");

const users = [];

const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};

const userJoin = (id, username, room) => {
  users.push({ id, username, room });
  return getUser(id);
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const userLeave = (id) => {
  const index = users.find((user) => user.id === id);

  if (index != -1) {
    return users.splice(index, 1);
  }
};

const getUserRoom = (room) => users.filter((user) => user.room === room);

module.exports = { formatMessage, userJoin, getUser, userLeave, getUserRoom };
