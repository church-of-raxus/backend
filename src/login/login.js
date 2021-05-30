module.exports = function(type, code) {
  const userData = fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${type} ${code}`,
    },
  });
  console.log(userData);
};