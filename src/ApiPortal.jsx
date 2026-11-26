import { useState } from "react";

function ApiPortal() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [activeEndpoint, setActiveEndpoint] = useState("/employees");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeTab, setCodeTab] = useState("JavaScript");

  const endpoints = [
    {
      method: "GET",
      path: "/health",
      description: "Check API health",
      active: true,
    },
    {
      method: "GET",
      path: "/employees",
      description: "Get all employees",
      active: true,
    },
    {
      method: "GET",
      path: "/brands",
      description: "Get all brands",
      active: true,
    },
    {
      method: "GET",
      path: "/processes",
      description: "Get all processes",
      active: true,
    },
    { method: "GET", path: "/pods", description: "Get all pods", active: true },
    {
      method: "GET",
      path: "/rosters",
      description: "Get employee rosters",
      active: true,
    },
    {
      method: "PUT",
      path: "/rosters/{roster_id}",
      description: "Update roster status",
      active: true,
    },
  ];

  const currentEndpoint = endpoints.find(
    (item) => item.path === activeEndpoint,
  );

  const testAPI = async () => {
    if (!currentEndpoint?.active) return;

    let requestUrl = `http://127.0.0.1:8000${activeEndpoint}`;
    let options = {
      method: currentEndpoint.method,
    };

    if (currentEndpoint.method === "PUT") {
      const rosterId = window.prompt("Enter Roster ID:");

      if (!rosterId) return;

      const status = window.prompt(
        "Enter status: working, weekly_off, leave, or holiday",
      );

      if (!status) return;

      requestUrl = requestUrl.replace("{roster_id}", rosterId);

      options.headers = {
        "Content-Type": "application/json",
      };

      options.body = JSON.stringify({ status });
    }

    setLoading(true);
    setResponse(null);

    try {
      const result = await fetch(requestUrl, options);
      const data = await result.json();

      setResponse({
        status: result.status,
        data: data,
      });
    } catch (error) {
      setResponse({
        status: "Error",
        data: {
          message:
            "Unable to connect. Make sure your FastAPI backend is running.",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  const codeExamples = {
    JavaScript:
      currentEndpoint.method === "PUT"
        ? `const rosterId = "b9257fc8-a05e-4869-89d7-63a89a46b8d0";

const response = await fetch(
  \`http://127.0.0.1:8000/rosters/\${rosterId}\`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "weekly_off"
    })
  }
);

const data = await response.json();
console.log(data);`
        : `const response = await fetch(
  "http://127.0.0.1:8000${activeEndpoint}"
);

const data = await response.json();
console.log(data);`,

    Python:
      currentEndpoint.method === "PUT"
        ? `import requests

roster_id = "b9257fc8-a05e-4869-89d7-63a89a46b8d0"

response = requests.put(
    f"http://127.0.0.1:8000/rosters/{roster_id}",
    json={"status": "weekly_off"}
)

print(response.json())`
        : `import requests

response = requests.get(
    "http://127.0.0.1:8000${activeEndpoint}"
)

print(response.json())`,

    cURL:
      currentEndpoint.method === "PUT"
        ? `curl -X PUT "http://127.0.0.1:8000/rosters/b9257fc8-a05e-4869-89d7-63a89a46b8d0" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"weekly_off"}'`
        : `curl -X GET "http://127.0.0.1:8000${activeEndpoint}"`,
  };
  const styles = `
    * { box-sizing: border-box; }

    .api-page {
      min-height: 100vh;
      background: #f7f8fc;
      color: #172033;
      font-family: Inter, Arial, sans-serif;
    }

    .api-topbar {
      height: 70px;
      background: white;
      border-bottom: 1px solid #e8ebf2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
    }

    .api-brand {
      font-size: 21px;
      font-weight: 800;
      color: #243b80;
    }

    .api-brand span { color: #6478d3; }

    .api-layout {
      display: flex;
      min-height: calc(100vh - 70px);
    }

    .api-sidebar {
      width: 245px;
      flex-shrink: 0;
      background: white;
      border-right: 1px solid #e8ebf2;
      padding: 27px 16px;
    }

    .api-label {
      font-size: 11px;
      color: #98a1b3;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 0 12px;
      margin: 20px 0 10px;
    }

    .api-nav {
      display: block;
      width: 100%;
      text-align: left;
      padding: 11px 13px;
      margin: 4px 0;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #647087;
      cursor: pointer;
      font-size: 14px;
    }

    .api-nav.active {
      background: #eef1ff;
      color: #4258bd;
      font-weight: 700;
    }

    .api-main {
      flex: 1;
      padding: 35px;
      min-width: 0;
    }

    .api-heading {
      font-size: 29px;
      margin: 0 0 9px;
      color: #182442;
    }

    .api-subtitle {
      color: #7b8498;
      font-size: 14px;
      margin-bottom: 27px;
    }

    .api-card {
      background: white;
      border: 1px solid #e9ecf3;
      border-radius: 12px;
      padding: 23px;
      margin-bottom: 20px;
      box-shadow: 0 3px 12px rgba(20,35,80,.025);
    }

    .api-card h3 {
      margin: 0 0 17px;
      font-size: 16px;
    }

    .api-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 17px;
      margin-bottom: 22px;
    }

    .api-stat-number {
      font-size: 27px;
      font-weight: 800;
      margin-bottom: 5px;
    }

    .api-stat-label {
      font-size: 13px;
      color: #8790a2;
    }

    .api-endpoint {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 14px 10px;
      border-top: 1px solid #f0f1f5;
      cursor: pointer;
      border-radius: 6px;
    }

    .api-endpoint:hover { background: #f8f9ff; }

    .api-method {
      font-size: 11px;
      font-weight: 800;
      color: #16865c;
      background: #e7f8f0;
      padding: 5px 8px;
      border-radius: 5px;
    }

    .api-path {
      font-family: Consolas, monospace;
      font-size: 13px;
      font-weight: 700;
    }

    .api-description {
      color: #8992a4;
      font-size: 13px;
      margin-left: auto;
    }

    .api-button {
      background: #4258bd;
      color: white;
      border: none;
      border-radius: 7px;
      padding: 11px 18px;
      cursor: pointer;
      font-weight: 700;
    }

    .api-button:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .api-code {
      background: #172033;
      color: #e3e9f7;
      border-radius: 8px;
      padding: 18px;
      white-space: pre-wrap;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.7;
      font-family: Consolas, monospace;
    }

    .api-response {
      background: #f5f7fb;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 15px;
      white-space: pre-wrap;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
    }

    .api-muted {
      color: #8790a2;
      font-size: 13px;
    }

    .api-badge {
      background: #e8f8ef;
      color: #16865c;
      padding: 6px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }

    .api-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }

    .api-table th,
    .api-table td {
      padding: 12px;
      border-bottom: 1px solid #e9ecf3;
      white-space: nowrap;
    }

    .api-table th {
      background: #f5f7fb;
      color: #4258bd;
    }

    @media(max-width: 750px) {
      .api-sidebar { width: 180px; }
      .api-main { padding: 20px; }
      .api-stats { grid-template-columns: 1fr; }
      .api-description { display: none; }
    }
  `;

  return (
    <div className="api-page">
      <style>{styles}</style>

      <header className="api-topbar">
        <div className="api-brand">
          DATA<span>STRAW</span>
        </div>
        <span className="api-badge">● API Online</span>
      </header>

      <div className="api-layout">
        <aside className="api-sidebar">
          <div className="api-label">DEVELOPER PORTAL</div>

          {["Overview", "API Reference", "API Explorer"].map((item) => (
            <button
              key={item}
              className={`api-nav ${activeSection === item ? "active" : ""}`}
              onClick={() => setActiveSection(item)}
            >
              {item === "Overview" ? "◫" : item === "API Reference" ? "▤" : "⌘"}{" "}
              &nbsp; {item}
            </button>
          ))}

          <div className="api-label">RESOURCES</div>

          {["Employees", "Brands", "Processes", "Pods", "Rosters"].map(
            (item) => (
              <button
                key={item}
                className={`api-nav ${activeSection === item ? "active" : ""}`}
                onClick={() => {
                  setActiveSection(item);

                  const endpointMap = {
                    Employees: "/employees",
                    Brands: "/brands",
                    Processes: "/processes",
                    Pods: "/pods",
                    Rosters: "/rosters",
                  };

                  setActiveEndpoint(endpointMap[item]);
                  setResponse(null);
                }}
              >
                ▪ &nbsp; {item}
              </button>
            ),
          )}

          <div className="api-label">INFORMATION</div>

          <button
            className="api-nav"
            onClick={() => window.open("http://127.0.0.1:8000/docs", "_blank")}
          >
            ↗ &nbsp; Swagger Documentation
          </button>
        </aside>

        <main className="api-main">
          <h1 className="api-heading">
            {activeSection === "Overview" ? "API Overview" : activeSection}
          </h1>

          <p className="api-subtitle">
            Welcome to the DataStraw Smart Roster Management API developer
            portal.
          </p>

          {activeSection === "Overview" && (
            <>
              <div className="api-stats">
                <div className="api-card">
                  <div className="api-stat-number">1.0.0</div>
                  <div className="api-stat-label">API Version</div>
                </div>

                <div className="api-card">
                  <div className="api-stat-number">6</div>
                  <div className="api-stat-label">Documented Endpoints</div>
                </div>

                <div className="api-card">
                  <div className="api-stat-number">Online</div>
                  <div className="api-stat-label">Backend Status</div>
                </div>
              </div>

              <div className="api-card">
                <h3>Welcome to Smart Roster API</h3>

                <p className="api-muted">
                  A centralized API for managing employees, brands, processes,
                  operational pods and employee schedules.
                </p>

                <p className="api-muted">
                  Use the API Explorer to send requests and inspect live JSON
                  responses.
                </p>
              </div>

              <div className="api-card">
                <h3>Available API Endpoints</h3>

                {endpoints.map((item) => (
                  <div
                    className="api-endpoint"
                    key={item.path}
                    onClick={() => {
                      setActiveEndpoint(item.path);
                      setActiveSection("API Explorer");
                    }}
                  >
                    <span className="api-method">{item.method}</span>
                    <span className="api-path">{item.path}</span>
                    <span className="api-description">
                      {item.active ? item.description : "Coming soon"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === "API Reference" && (
            <div className="api-card">
              <h3>API Reference</h3>

              <p className="api-muted">
                Explore the available endpoints and their purpose. Endpoints
                marked Coming soon are planned but not implemented yet.
              </p>

              {endpoints.map((item) => (
                <div className="api-endpoint" key={item.path}>
                  <span className="api-method">{item.method}</span>
                  <span className="api-path">{item.path}</span>
                  <span className="api-description">
                    {item.active ? item.description : "Coming soon"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {[
            "API Explorer",
            "Employees",
            "Brands",
            "Processes",
            "Pods",
            "Rosters",
          ].includes(activeSection) && (
            <>
              <div className="api-card">
                <h3>Request Builder</h3>

                <p className="api-muted">
                  Select an endpoint and execute a live API request.
                </p>

                <label className="api-muted">HTTP METHOD</label>
                <p>
                  <span className="api-method">GET</span>
                </p>

                <label className="api-muted">REQUEST URL</label>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  <input
                    value={`http://127.0.0.1:8000${activeEndpoint}`}
                    readOnly
                    style={{
                      flex: 1,
                      minWidth: 220,
                      padding: 12,
                      border: "1px solid #e1e5ed",
                      borderRadius: 7,
                      fontFamily: "Consolas",
                    }}
                  />

                  <button
                    type="button"
                    className="api-button"
                    onClick={testAPI}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "▶ Send Request"}
                  </button>
                </div>

                <p className="api-muted" style={{ marginTop: 12 }}>
                  {currentEndpoint?.active
                    ? "This endpoint is available for testing."
                    : "This endpoint is planned but has not been implemented yet."}
                </p>
              </div>

              <div className="api-card">
                <h3>Code Examples</h3>

                <div style={{ display: "flex", gap: 8, marginBottom: 15 }}>
                  {["JavaScript", "Python", "cURL"].map((tab) => (
                    <button
                      key={tab}
                      className="api-nav active"
                      style={{
                        width: "auto",
                        background: codeTab === tab ? "#eef1ff" : "#f5f6fa",
                      }}
                      onClick={() => setCodeTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <pre className="api-code">{codeExamples[codeTab]}</pre>
              </div>

              <div className="api-card">
                <h3>Response</h3>

                {response ? (
                  <>
                    <p>
                      HTTP Status:{" "}
                      <span className="api-badge">{response.status}</span>
                    </p>

                    {activeEndpoint === "/employees" &&
                    Array.isArray(response.data.employees) ? (
                      <div style={{ overflowX: "auto" }}>
                        <table className="api-table">
                          <thead>
                            <tr>
                              <th>Employee Code</th>
                              <th>Full Name</th>
                              <th>Email</th>
                              <th>Job Title</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {response.data.employees.map((employee) => (
                              <tr key={employee.id}>
                                <td>{employee.employee_code}</td>
                                <td>{employee.full_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.job_title}</td>
                                <td>{employee.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : activeEndpoint === "/rosters" &&
                      Array.isArray(response.data.rosters) ? (
                      <div style={{ overflowX: "auto" }}>
                        <table className="api-table">
                          <thead>
                            <tr>
                              <th>Roster Date</th>
                              <th>Employee ID</th>
                              <th>Brand ID</th>
                              <th>Process ID</th>
                              <th>Pod ID</th>
                              <th>Shift</th>
                              <th>Status</th>
                              <th>Manual Edit</th>
                            </tr>
                          </thead>

                          <tbody>
                            {response.data.rosters.map((roster) => (
                              <tr key={roster.id}>
                                <td>{roster.roster_date}</td>
                                <td>{roster.employee_id}</td>
                                <td>{roster.brand_id}</td>
                                <td>{roster.process_id}</td>
                                <td>{roster.pod_id}</td>
                                <td>{roster.shift}</td>
                                <td>{roster.status}</td>
                                <td>{roster.is_manual_edit ? "Yes" : "No"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <pre className="api-response">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    )}
                  </>
                ) : (
                  <p className="api-muted">
                    No response yet. Click Send Request to test this endpoint.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ApiPortal;
