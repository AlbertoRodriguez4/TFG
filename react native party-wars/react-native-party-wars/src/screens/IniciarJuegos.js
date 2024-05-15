import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

const IniciarJuegos = ({ route }) => {
    const { salaId } = route.params; // Obtén el ID de la sala desde los parámetros de la ruta
    const [juegoId, setJuegoId] = useState(null); // Estado para almacenar el ID del juego
    const [juego, setJuego] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [preguntaIndex, setPreguntaIndex] = useState(0); // Estado para almacenar el índice de la pregunta actual

    useEffect(() => {
        fetchJuego();
    }, []);

    const fetchJuego = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos`);
            const data = await response.json();
            // Supongamos que obtenemos el primer juego de la lista de juegos de la sala
            const primerJuego = data[0];
            setJuegoId(primerJuego.id); // Almacenamos el ID del juego
            setJuego(primerJuego);
            fetchPreguntasDeJuego(primerJuego.id); // Llamamos a la función para obtener las preguntas del juego
        } catch (error) {
            console.error('Error al obtener el juego:', error);
        }
    };

    const fetchPreguntasDeJuego = async (juegoId) => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/juegos/${juegoId}/preguntas`);
            const data = await response.json();
            console.log(data);
            setPreguntas(data);
        } catch (error) {
            console.error('Error al obtener las preguntas del juego:', error);
        }
    };

    const avanzarPregunta = () => {
        setPreguntaIndex(prevIndex => prevIndex + 1); // Avanzamos al índice de la siguiente pregunta
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Juego: {juego ? juego.nombre : ""}</Text>
            <Text style={styles.subtitle}>Preguntas:</Text>
            <View style={styles.preguntaContainer}>
                <Text>{preguntas.length > 0 ? preguntas[preguntaIndex].pregunta : "Cargando pregunta..."}</Text>
            </View>
            <Button title="Avanzar" onPress={avanzarPregunta} disabled={preguntaIndex >= preguntas.length - 1} />
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
});

export default IniciarJuegos;



