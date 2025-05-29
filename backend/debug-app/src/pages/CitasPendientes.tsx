import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';


const CitasPendientes: React.FC = () => {
 
  return (
    <div>
      <h2>Citas Pendientes</h2>
      <Card>
        <Card.Body>
          <Card.Title>Nombre del Animal</Card.Title>
          <Card.Text>Fecha: 2023-09-15</Card.Text>
          <Card.Text>Hora: 10:00 AM</Card.Text>
          <Card.Text>Asociación: Asociación de Mascotas</Card.Text>
          <Button variant="primary">Ver Detalles</Button>
        </Card.Body>  
      </Card>
    </div>
  );
};