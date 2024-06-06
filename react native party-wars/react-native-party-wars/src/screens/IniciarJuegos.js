import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

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

  const GradientText = ({ text, style }) => (
    <MaskedView
      style={{ flex: 1 }}
      maskElement={
        <View style={{ backgroundColor: 'transparent' }}>
          <Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>
        </View>
      }
    >
      <LinearGradient
        colors={['#FFDE59','#FF914D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Party <Text style={styles.titleBold}>Wars</Text></Text>
        </View>

        <LinearGradient
          colors={['#7cfff7', '#ff88e5']}
          style={styles.bottomSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={require('../assets/mono-premium.jpeg')} style={styles.backgroundImage} />

          <View style={styles.contentContainer}>
            <GradientText text={`${juegos[juegoIndex] ? juegos[juegoIndex].nombre : ""}`} style={styles.gameTitle} />
            {preguntas.length > 0 ? (
              <View style={styles.preguntaSection}>
                <Text style={styles.preguntaTexto}>{preguntas[preguntaIndex].pregunta}</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={avanzarPregunta} disabled={preguntaIndex >= preguntas.length - 1}>
                  <LinearGradient colors={['#FFDE59', '#FF914D']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.buttonText}>Avanzar</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {preguntaIndex >= preguntas.length - 1 && (
                  <View style={styles.avanzarContainer}>
                    <Text style={styles.avanzarTexto}>El juego ya ha acabado, ¿Quiere pasar al siguiente juego?</Text>
                    <TouchableOpacity style={styles.buttonContainer} onPress={siguienteJuego}>
                      <LinearGradient colors={['#313131', '#313131']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={styles.buttonText}>{juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <GradientText text="Descripción:" style={styles.subtitle} />
                <Text style={styles.descripcionTexto}>{juegos[juegoIndex] ? juegos[juegoIndex].descripcionJuego : "Cargando descripción..."}</Text>
                <GradientText text="Normas:" style={styles.subtitle} />
                <Text style={styles.descripcionTexto}>{juegos[juegoIndex] ? juegos[juegoIndex].normasJuego : "Cargando normas..."}</Text>
                <View style={styles.avanzarContainer}>
                  <Text style={styles.avanzarTexto}>El juego no tiene preguntas, ¿Quiere pasar al siguiente juego?</Text>
                  <TouchableOpacity style={styles.buttonContainer} onPress={siguienteJuego}>
                    <LinearGradient colors={['#313131', '#313131']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Text style={styles.buttonText}>{juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313131',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    flex: 1,
    top: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 50, 
  },
  bottomSection: {
    flex: 7,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    marginTop: 80,
  },
  textMask: {
    backgroundColor: 'transparent',
  },
  transparentText: {
    backgroundColor: 'transparent',
  },
  hiddenText: {
    opacity: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gameTitle: {
    fontSize: 30,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  preguntaSection: {
    alignItems: 'center',
  },
  preguntaTexto: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
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
  buttonContainer: {
    width: '80%',
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFDE59',
  },
});

export default IniciarJuegos;
