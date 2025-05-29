import React, { useState } from 'react';
import './App.css';

interface Endpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST';
}

function App() {
  const [endpoints] = useState<Endpoint[]>([
    { name: 'Obtener Citas Pendientes', url: '/api/debug/citasPendientes', method: 'GET' },
    { name: 'Validar Cita', url: '/api/debug/citaPosible/validar', method: 'POST' },
    { name: 'Obtener Animales', url: '/api/animal', method: 'GET' },
    { name: 'Obtener Asociaciones', url: '/api/asociaciones', method: 'GET' },
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345');

  const encode = (str: string) => btoa(unescape(encodeURIComponent(str)));

  const handleEndpointSelect = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setResponse(null);
    if (endpoint.method === 'POST') {
      setRequestBody(JSON.stringify({ idCitaPosible: '', nuevoEstado: 'aceptada' }, null, 2));
    } else {
      setRequestBody('');
    }
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;
    setLoading(true);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + encode(`${username}:${password}`)
    };

    const options: RequestInit = {
      method: selectedEndpoint.method,
      headers
    };

    try {
      if (selectedEndpoint.method === 'POST') {
        try {
          JSON.parse(requestBody); // Validación de JSON
          options.body = requestBody;
        } catch (err) {
          setResponse({ error: 'Cuerpo de la petición inválido. Asegúrate de escribir un JSON válido.' });
          setLoading(false);
          return;
        }
      }

      const res = await fetch(selectedEndpoint.url, options);
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PetMatch - Panel de Depuración</h1>
        <div className="auth-section">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </header>

      <div className="content">
        <div className="endpoints-list">
          <h2>Endpoints Disponibles</h2>
          <ul>
            {endpoints.map((endpoint, index) => (
              <li
                key={index}
                className={selectedEndpoint?.url === endpoint.url ? 'selected' : ''}
                onClick={() => handleEndpointSelect(endpoint)}
              >
                <span className={`method ${endpoint.method}`}>{endpoint.method}</span>
                <span className="name">{endpoint.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="request-section">
          {selectedEndpoint && (
            <>
              <h2>Ejecutar: {selectedEndpoint.name}</h2>
              <div className="endpoint-url">
                <span className={`method ${selectedEndpoint.method}`}>{selectedEndpoint.method}</span>
                <span>{selectedEndpoint.url}</span>
              </div>

              {selectedEndpoint.method === 'POST' && (
                <div className="request-body">
                  <h3>Cuerpo de la Petición (JSON)</h3>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={10}
                  />
                </div>
              )}

              <button onClick={executeRequest} disabled={loading}>
                {loading ? 'Ejecutando...' : 'Ejecutar Petición'}
              </button>
            </>
          )}
        </div>

        <div className="response-section">
          <h2>Respuesta</h2>
          {response ? (
            <div className="response-content">
              <div className="response-status">
                Estado:{' '}
                <span className={response.status < 400 ? 'success' : 'error'}>
                  {response.status || 'Error'}
                </span>
              </div>
              <pre>{JSON.stringify(response.data || response.error, null, 2)}</pre>
            </div>
          ) : (
            <div className="no-response">Selecciona un endpoint y ejecuta una petición</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
