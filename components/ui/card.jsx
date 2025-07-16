export function Card({ children }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #eee",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </div>
  );
}
