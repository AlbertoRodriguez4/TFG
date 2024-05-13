import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SalasUsuario = ({ route }) => {
    const [salas, setSalas] = useState([]);
    const [id, setId] = useState(0);

    useEffect(() => {
        loadUserData();
        fetchSalasUsuario();
    }, []);
    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                setId(id);
            }
            console.log(id);
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    };

    const fetchSalasUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/usuarios/${id}/salas`);
            const data = await response.json();
            console.log(data)
            setSalas(data);
        } catch (error) {
            console.error('Error al obtener las salas del usuario:', error);
        }
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
