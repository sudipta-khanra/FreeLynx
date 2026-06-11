function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚧 Under Construction</h1>
        <p style={styles.text}>
          We're working hard to bring this page to life.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: '#fff',
    padding: '2rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '2rem',
  },
  text: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '1.1rem',
  },
};

export default App;
