// lib/session.js
const { cookies } = require("next/headers");
const { SESSION_COOKIE, verify } = require("./auth");
const { getStore } = require("./store");

function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const payload = verify(token);
  if (!payload) return null;
  const store = getStore();
  const user = store.users.find((u) => u.id === payload.uid);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = { getSession };
