import { useEffect, useState } from "react";

export default function UserList({ onSelectUser, token }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      }
    }
    if (token) fetchUsers();
  }, [token]);

  return (
    <div style={{ borderRight: "1px solid #ddd", padding: "1rem", width: "200px" }}>
      <h3>Users</h3>
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => onSelectUser(u._id)}
          style={{
            cursor: "pointer",
            padding: "0.5rem",
            borderBottom: "1px solid #eee",
          }}
        >
          {u.name || u.email}
        </div>
      ))}
    </div>
  );
}
