import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const IniciarJuegos = ({ route }) => {
  const { salaId } = route.params;
  const [juegos, setJuegos] = useState([]);
  const [juegoIndex, setJuegoIndex] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchJuegos();
  }, []);

  const fetchJuegos = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos`);
      const data = await response.json();
      setJuegos(data);
    } catch (error) {
      console.error('Error al obtener los juegos:', error);
    }
  };

  const fetchPreguntasDeJuego = async (juegoId) => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/juegos/${juegoId}/preguntas`);
      const data = await response.json();
      setPreguntas(data);
    } catch (error) {
      console.error('Error al obtener las preguntas del juego:', error);
    }
  };

  const avanzarPregunta = () => {
    if (preguntaIndex < preguntas.length - 1) {
      setPreguntaIndex(prevIndex => prevIndex + 1);
    }
  };

  const siguienteJuego = () => {
    if (juegoIndex < juegos.length - 1) {
      setJuegoIndex(prevIndex => prevIndex + 1);
      setPreguntaIndex(0);
      fetchPreguntasDeJuego(juegos[juegoIndex + 1].id);
    } else {
      Alert.alert('Party wars terminado', 'Gracias por jugar', [
        {
          text: 'OK',
          onPress: () => { },
        }
      ]);
      navigation.navigate("SalasUsuarioUnido");
    }
  };

  useEffect(() => {
    if (juegos.length > 0) {
      fetchPreguntasDeJuego(juegos[juegoIndex].id);
    }
  }, [juegoIndex, juegos]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego: {juegos[juegoIndex] ? juegos[juegoIndex].nombre : ""}</Text>
      {preguntas.length > 0 ? (
        <View>
          <Text style={styles.subtitle}>Preguntas:</Text>
          <View style={styles.preguntaContainer}>
            <Text style={styles.preguntaTexto}>{preguntas[preguntaIndex].pregunta}</Text>
            <TouchableOpacity style={styles.button} onPress={avanzarPregunta} disabled={preguntaIndex >= preguntas.length - 1}>
              <Text style={styles.buttonText}>Avanzar</Text>
            </TouchableOpacity>
          </View>
          {preguntaIndex >= preguntas.length - 1 && (
            <View style={styles.avanzarContainer}>
              <Text style={styles.avanzarTexto}>El juego ya ha acabado, ¿Quiere pasar al siguiente juego?</Text>
              <TouchableOpacity style={styles.button} onPress={siguienteJuego}>
                <Text style={styles.buttonText}>{juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.subtitle}>Descripción:</Text>
          <Text style={styles.descripcionTexto}>{juegos[juegoIndex] ? juegos[juegoIndex].descripcionJuego : "Cargando descripción..."}</Text>
          <Text style={styles.subtitle}>Normas:</Text>
          <Text style={styles.descripcionTexto}>{juegos[juegoIndex] ? juegos[juegoIndex].normasJuego : "Cargando normas..."}</Text>
          <View style={styles.avanzarContainer}>
            <Text style={styles.avanzarTexto}>El juego no tiene preguntas, ¿Quiere pasar al siguiente juego?</Text>
            <TouchableOpacity style={styles.button} onPress={siguienteJuego}>
              <Text style={styles.buttonText}>{juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD700',
  },
  preguntaContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    backgroundColor: '#333333',
  },
  preguntaTexto: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  avanzarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avanzarTexto: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  descripcionTexto: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#1e1e1e',
    textAlign: 'center',
  },
});

export default IniciarJuegos;
