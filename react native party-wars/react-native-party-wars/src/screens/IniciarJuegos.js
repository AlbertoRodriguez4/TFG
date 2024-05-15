import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";

const IniciarJuegos = ({ route }) => {
    const { salaId } = route.params;
    const [juegos, setJuegos] = useState([]);
    const [juegoIndex, setJuegoIndex] = useState(0);
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaIndex, setPreguntaIndex] = useState(0);

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
            console.log(juegoId);
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
        }
    };

    useEffect(() => {
        if (juegos.length > 0) {
            fetchPreguntasDeJuego(juegos[juegoIndex].id);
        } else {
            // Si no hay juegos disponibles, muestra un mensaje de error
            Alert.alert('Error', 'No hay juegos disponibles');
        }
    }, [juegoIndex, juegos]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Juego: {juegos[juegoIndex] ? juegos[juegoIndex].nombre : ""}</Text>
            {preguntas.length > 0 ? (
                <View>
                    <Text style={styles.subtitle}>Preguntas:</Text>
                    <View style={styles.preguntaContainer}>
                        <Text>{preguntas[preguntaIndex].pregunta}</Text>
                        <Button title="Avanzar" onPress={avanzarPregunta} disabled={preguntaIndex >= preguntas.length - 1} />
                    </View>
                    {preguntaIndex >= preguntas.length - 1 && (
                        <View style={styles.avanzarContainer}>
                            <Text>El juego ya ha acabado, ¿Quiere pasar al siguiente juego?</Text>
                            <Button title={juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"} onPress={siguienteJuego} />
                        </View>
                    )}
                </View>
            ) : (
                <View>
                    <Text style={styles.subtitle}>Descripción:</Text>
                    <Text>{juegos[juegoIndex] ? juegos[juegoIndex].descripcionJuego : "Cargando descripción..."}</Text>
                    <Text style={styles.subtitle}>Normas:</Text>
                    <Text>{juegos[juegoIndex] ? juegos[juegoIndex].normasJuego : "Cargando normas..."}</Text>
                    {/* Si no hay preguntas, permite avanzar al siguiente juego */}
                    <View style={styles.avanzarContainer}>
                        <Text>El juego no tiene preguntas, ¿Quiere pasar al siguiente juego?</Text>
                        <Button title={juegoIndex < juegos.length - 1 ? "Siguiente juego" : "Terminar Party Wars"} onPress={siguienteJuego} />
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
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    preguntaContainer: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
    },
    avanzarContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default IniciarJuegos;


