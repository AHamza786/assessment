import React, { useEffect, useMemo, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

function Items() {
  const { items, total, fetchItems } = useData();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [query, setQuery] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / pageSize)),
    [total, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      setLoading(true);
      fetchItems({
        page,
        pageSize,
        q: query,
        signal: controller.signal,
      }).finally(() => setLoading(false));
    }, 400);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [page, pageSize, query, fetchItems]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #9333ea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ color: "#666", fontSize: "16px" }}>Loading items...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // if (items.length == 0) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         minHeight: "60vh",
  //         flexDirection: "column",
  //         gap: "16px",
  //       }}
  //     >
  //       <p style={{ color: "#666", fontSize: "18px" }}>No items found</p>
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 20px",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 8px 0",
          }}
        >
          Products
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            margin: 0,
          }}
        >
          Browse our collection of {total || items.length} items
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Search by name..."
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              minWidth: "240px",
            }}
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(parseInt(e.target.value, 10));
            }}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: page <= 1 ? "#f9fafb" : "white",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: page >= totalPages ? "#f9fafb" : "white",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div>
        <List
          height={800}
          width={1200}
          itemCount={items.length}
          itemSize={220}
          style={{ maxWidth: "100%" }}
        >
          {({ index, style }) => {
            const item = items[index];
            return (
              <div style={{ ...style, padding: "0 0 24px 0" }}>
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      border: "1px solid #e5e7eb",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                      e.currentTarget.style.borderColor = "#9333ea";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "20px",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#111827",
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </h3>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "#f3f4f6",
                            color: "#6b7280",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "16px",
                        borderTop: "1px solid #f3f4f6",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          marginBottom: "4px",
                        }}
                      >
                        Price
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        ${item.price.toLocaleString()}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "16px",
                        fontSize: "14px",
                        color: "#9333ea",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      View Details →
                    </div>
                  </div>
                </Link>
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
}

export default Items;
