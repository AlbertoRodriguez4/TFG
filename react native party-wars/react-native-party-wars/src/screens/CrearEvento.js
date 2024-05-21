import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateRoomScreen = () => {
    const [nombreSala, setNombreSala] = useState('');
    const [edadMinEvento, setEdadMinEvento] = useState('');
    const [edadMaxEvento, setEdadMaxEvento] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [tematicaEvento, setTematicaEvento] = useState('');
    const [descripcionEvento, setDescripcionEvento] = useState('');
    const [localizacionEvento, setLocalizacionEvento] = useState('');
    const [cantidadAsistentes, setCantidadAsistentes] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [id, setId] = useState(0);
    const [idNavigationEventos, setIdNavigationEventos] = useState(0);

    useEffect(() => {
        loadUserData();
    }, []);

    const handleCreateEvent = async () => {
        try {
            const response = await fetch('http://192.168.1.90:3000/eventos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreSala,
                    edadMinEvento: parseInt(edadMinEvento),
                    edadMaxEvento: parseInt(edadMaxEvento),
                    localizacion,
                    tematicaEvento,
                    descripcionEnvento,
                    localizacionEvento,
                    cantidadAsistentes: parseInt(cantidadAsistentes),
                    fechaEvento,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }

            const data = await response.json();
            setIdNavigationEventos(data);

            Alert.alert('Evento Creado', 'El evento se ha creado exitosamente');
            console.log('ID del evento creado:', data);

            setNombreSala('');
            setEdadMinEvento('');
            setEdadMaxEvento('');
            setLocalizacion('');
            setTematicaEvento('');
            setDescripcionEvento('');
            setLocalizacionEvento('');
            setCantidadAsistentes('');
            setFechaEvento('');

            handleVerEventos();
        } catch (error) {
            console.error('Error al crear el evento:', error);
            Alert.alert('Error', 'Ocurrió un error al crear el evento. Por favor, inténtalo de nuevo.');
        }
    };

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                setId(id);
                alert("El ID del usuario es " + id);
                console.log("El ID del usuario es " + id);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    };

    useEffect(() => {
        if (idNavigationEventos !== 0) {
            handleJoinEvent();
        }
    }, [idNavigationEventos]);

    const handleJoinEvent = async () => {
        try {
            loadUserData();
            console.log("Me he unido al evento " + idNavigationEventos + " y soy el usuario con ID " + id);
            const response = await fetch(`http://192.168.1.90:3000/eventos/${idNavigationEventos}/usuario/${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                Alert.alert('Éxito', 'Te has unido al evento correctamente');
            } else {
                throw new Error('Error al unirse al evento');
            }
        } catch (error) {
            console.error('Error al unirse al evento:', error);
        }
    };

    const handleVerEventos = () => {
        navigation.navigate('VerEventos', { idNavigationEventos });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Evento</Text>
            <TextInput
                placeholder="Nombre de la Sala"
                value={nombreSala}
                onChangeText={setNombreSala}
                style={styles.input}
            />
            <TextInput
                placeholder="Edad Mínima del Evento"
                value={edadMinEvento}
                onChangeText={setEdadMinEvento}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Edad Máxima del Evento"
                value={edadMaxEvento}
                onChangeText={setEdadMaxEvento}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Localización"
                value={localizacion}
                onChangeText={setLocalizacion}
                style={styles.input}
            />
            <TextInput
                placeholder="Temática del Evento"
                value={tematicaEvento}
                onChangeText={setTematicaEvento}
                style={styles.input}
            />
            <TextInput
                placeholder="Descripción del Evento"
                value={descripcionEvento}
                onChangeText={setDescripcionEvento} // Corregido el nombre de la función
                style={styles.input}
            />

            <TextInput
                placeholder="Localización del Evento"
                value={localizacionEvento}
                onChangeText={setLocalizacionEvento}
                style={styles.input}
            />
            <TextInput
                placeholder="Cantidad de Asistentes"
                value={cantidadAsistentes}
                onChangeText={setCantidadAsistentes}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Fecha del Evento (YYYY-MM-DD)"
                value={fechaEvento}
                onChangeText={setFechaEvento}
                style={styles.input}
            />
            <Button title="Confirmar Ajustes" onPress={handleCreateEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
});

export default CreateRoomScreen;
