import { useEffect, useState } from 'react'
import ApiPortal from './ApiPortal'

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showApiPortal, setShowApiPortal] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching employees:', error)
        setLoading(false)
      })
  }, [])
    if (showApiPortal) {
    return (
      <>
        <button
          onClick={() => setShowApiPortal(false)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '12px 18px',
            background: '#243b80',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Employee Dashboard
        </button>

        <ApiPortal />
      </>
    )
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f1f5f9',
      padding: '35px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      color: '#172554',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#64748b',
      marginBottom: '25px',
    },
    card: {
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      background: '#1e40af',
      color: 'white',
      padding: '14px',
      fontSize: '14px',
    },
    td: {
      padding: '13px 14px',
      borderBottom: '1px solid #e2e8f0',
      color: '#334155',
      fontSize: '14px',
    },
  }

  return (
    <div style={styles.page}>
     <div style={{ marginBottom: '30px' }}>

  <button
    onClick={() => setShowApiPortal(true)}
    style={{
      background: '#243b80',
      color: 'white',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontWeight: 'bold',
    }}
  >
    Explore Developer API →
  </button>

  <h1
    style={{
      color: '#172554',
      fontSize: '38px',
      lineHeight: '1.3',
      margin: '0 0 10px 0',
      fontWeight: '700',
    }}
  >
    Smart Roster Management System
  </h1>

  <p
    style={{
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.5',
      margin: '0',
    }}
  >
    Employee Management Dashboard
  </p>

</div>

      <div style={styles.card}>
        <h2 style={{ color: '#1e293b' }}>Employee List</h2>

        <p style={{ color: '#64748b' }}>
          Total Employees: {employees.length}
        </p>

        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Sr. No.</th>
                <th style={styles.th}>Employee Code</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Job Title</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, index) => (
                <tr
                  key={employee.id}
                  style={{
                    background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{employee.employee_code}</td>
                  <td style={styles.td}>{employee.full_name}</td>
                  <td style={styles.td}>{employee.email}</td>
                  <td style={styles.td}>{employee.job_title}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )

}

export default App