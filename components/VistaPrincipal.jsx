import React from 'react';
import TemActual from './TemperaturaActual.jsx';
import { ScrollView } from 'react-native';

// Componente principal que integra otros componentes
const VistaPrincipal = () => {
  return (
    <ScrollView>
      <TemActual />
      {/* Agrega aquí otros componentes si los tienes */}
    </ScrollView>
  );
};

export default VistaPrincipal;
