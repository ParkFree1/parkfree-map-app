export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 16px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
