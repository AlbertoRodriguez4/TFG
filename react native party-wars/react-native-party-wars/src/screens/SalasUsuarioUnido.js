import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native'; // Importa Alert de react-native
import AsyncStorage from '@react-native-async-storage/async-storage';

const SalasUsuario = ({ route }) => {
    const [salas, setSalas] = useState([]);
    const [id, setId] = useState(0);
    const [salasPrimero, setSalasPrimero] = useState([]);
    const [salasNoPrimero, setSalasNoPrimero] = useState([]);

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (id !== 0) {
            fetchSalasUsuario();
        }
    }, [id]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                setId(id);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    };

    const fetchSalasUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/usuarios/${id}/salas`);
            const data = await response.json();
            setSalas(data);
            guardarIdSalas(data);
        } catch (error) {
            console.error('Error al obtener las salas del usuario:', error);
        }
    };

    const guardarIdSalas = async (data) => {
        const ids = data.map(sala => sala.id);
        try {
            await AsyncStorage.setItem('idSalas', JSON.stringify(ids));
            // Llamar automáticamente a fetchUsuariosSala para cada sala
            data.forEach(sala => fetchUsuariosSala(sala.id));
        } catch (error) {
            console.error('Error al guardar el ID de las salas:', error);
        }
    };

    const fetchUsuariosSala = async (salaId) => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
            const usuarios = await response.json();
            
            // Guardar las salas en arrays separados dependiendo de si eres el primero o no
            if (usuarios[0] && usuarios[0].id === id) {
                setSalasPrimero(prevState => [...prevState, salaId]);
            } else {
                setSalasNoPrimero(prevState => [...prevState, salaId]);
            }
            
            // Imprimir información sobre si el usuario es el primero o no en la sala
            if (usuarios[0] && usuarios[0].id === id) {
                console.log(`Soy primero en la sala ${salaId}`);
            } else {
                console.log(`No soy primero en la sala ${salaId}`);
            }
        } catch (error) {
            console.error('Error al obtener los usuarios de la sala:', error);
        }
    };

    const handleIniciarPartyWars = (salaId) => {
        Alert.alert('ID de la sala', `El ID de la sala es: ${salaId}`);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Salas del Usuario</Text>
            {salas.map((sala) => (
                <View key={sala.id} style={styles.salaContainer}>
                    <Text style={styles.salaNombre}>{sala.nombre}</Text>
                    <Text style={styles.salaDescripcion}>{sala.descripcion}</Text>
                    <Text style={styles.salaTematica}>Tematica: {sala.tematicaSala}</Text>
                    <Text style={styles.salaEdades}>Edad mínima: {sala.edadMinima} - Edad máxima: {sala.edadMaxima}</Text>
                    <Text style={styles.salaLocalizacion}>Localización: {sala.localizacionSala}</Text>
                    <Text style={styles.salaParticipantes}>Participantes: {sala.numeroParticipantes}</Text>
                    {/* Mostrar botón solo si el usuario es el primero en la sala */}
                    {salasPrimero.includes(sala.id) && (
                        <Button title="Iniciar Party Wars" onPress={() => handleIniciarPartyWars(sala.id)} />
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    salaContainer: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
    },
    salaNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    salaDescripcion: {
        fontSize: 16,
        marginBottom: 10,
    },
    salaTematica: {
        fontSize: 16,
        marginBottom: 5,
    },
    salaEdades: {
        fontSize: 16,
        marginBottom: 5,
    },
    salaLocalizacion: {
        fontSize: 16,
        marginBottom: 5,
    },
    salaParticipantes: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default SalasUsuario;



