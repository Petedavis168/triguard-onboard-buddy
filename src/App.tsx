const App = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      backgroundColor: 'red',
      color: 'white', 
      padding: '10px',
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: 'bold'
    }}>
      BASIC APP LOADED!!!
    </div>
    
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        TriGuard Roofing
      </h1>
      
      <p style={{
        fontSize: '18px',
        color: '#64748b',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        Employee Onboarding System - Test Version
      </p>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <a href="/onboarding" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          Start Onboarding
        </a>
        
        <a href="/user-login" style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          Employee Login
        </a>
        
        <a href="/admin-login" style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          Admin Login
        </a>
      </div>
    </div>
  </div>
);

export default App;
