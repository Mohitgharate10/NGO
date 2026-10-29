function AdminTable({ headers, children }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#1e5eff", color: "white" }}>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: "10px", textAlign: "left" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export default AdminTable;
