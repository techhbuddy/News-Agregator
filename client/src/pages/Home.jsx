export default function Home({ user }) {
  return (
    <div>
      <h2>Welcome, {user?.name || "Guest"}!</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
}
