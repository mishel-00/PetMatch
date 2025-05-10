import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { Cita, ActionResult } from '../types';
import { fetchCitasPendientes, validarCita } from '../services/api';

const CitasPendientes: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchCitasPendientes();
      setCitas(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('Error al cargar las citas pendientes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCita = async (idCita: string, nuevoEstado: 'aceptada' | 'rechazada'): Promise<void> => {
    setLoading(true);
    try {
      const response = await validarCita(idCita, nuevoEstado);
      
      setActionResult({
        success: true,
        message: nuevoEstado === 'aceptada' 
          ? 'Cita aceptada correctamente' 
          : 'Cita rechazada correctamente'
      });
      
      if (response.qrCodeURL) {
        setCurrentQR(response.qrCodeURL);
        setShowModal(true);
      }
      
      // Recargar la lista de citas
      loadCitas();
    } catch (err: any) {
      console.error('Error al validar cita:', err);
      setActionResult({
        success: false,
        message: `Error al ${nuevoEstado === 'aceptada' ? 'aceptar' : 'rechazar'} la cita: ${err.response?.data?.error || err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setCurrentQR(null);
  };

  if (loading && citas.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando citas pendientes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Citas Pendientes</h1>
        <Button variant="outline-primary" onClick={loadCitas} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {actionResult && (
        <Alert 
          variant={actionResult.success ? 'success' : 'danger'} 
          onClose={() => setActionResult(null)} 
          dismissible
        >
          {actionResult.message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {citas.length === 0 ? (
        <Alert variant="info">
          No hay citas pendientes en este momento.
        </Alert>
      ) : (
        <div className="row">
          {citas.map(cita => (
            <div key={cita.id} className="col-md-6 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Cita #{cita.id}</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {cita.fecha}<br />
                    <strong>Hora:</strong> {cita.hora}<br />
                    <strong>Estado:</strong> {cita.estado}<br />
                    <strong>Adoptante:</strong> {cita.adoptante.nombre} (ID: {cita.adoptante.id})<br />
                    <strong>Animal:</strong> {cita.animal.nombre} {cita.animal.id ? `(ID: ${cita.animal.id})` : ''}<br />
                    {cita.observaciones && (
                      <>
                        <strong>Observaciones:</strong> {cita.observaciones}<br />
                      </>
                    )}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={() => handleValidarCita(cita.id, 'aceptada')}
                      disabled={loading}
                    >
                      Aceptar
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleValidarCita(cita.id, 'rechazada')}
                      disabled={loading}
                    >
                      Rechazar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Código QR Generado</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {currentQR && (
            currentQR.startsWith('data:image') ? (
              <img src={currentQR} alt="Código QR" style={{ maxWidth: '100%' }} />
            ) : (
              <QRCodeSVG value={currentQR} size={256} />
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CitasPendientes;