import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-center mb-4">Panel de Depuración PetMatch</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Citas Pendientes</Card.Title>
              <Card.Text>
                Ver y gestionar todas las citas pendientes. Aceptar o rechazar solicitudes.
              </Card.Text>
              <Link to="/citas-pendientes">
                <Button variant="primary">Ir a Citas</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;