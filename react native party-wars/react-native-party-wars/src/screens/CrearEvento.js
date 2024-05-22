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
    const [descripcionEnvento, setDescripcionEnvento] = useState('');
    const [localizacionEvento, setLocalizacionEvento] = useState('');
    const [cantidadAsistentes, setCantidadAsistentes] = useState('');
    const [fechaEvento, setFechaEvento] = useState('');
    const [nombreEmpEvento, setNombreEmpEvento] = useState('');
    const [linksDeReferencia, setLinksDeReferencia] = useState('');
    const [requiereCompraEntradas, setRequiereCompraEntradas] = useState(false);
    const [precioEntrada, setPrecioEntrada] = useState('');
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
                    nombreEmpEvento,
                    linksDeReferencia,
                    requiereCompraEntradas,
                    precioEntrada: requiereCompraEntradas ? parseFloat(precioEntrada) : null,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }

            const data = await response.json();
            setIdNavigationEventos(data);

            console.log('ID del evento creado:', data);

            setNombreSala('');
            setEdadMinEvento('');
            setEdadMaxEvento('');
            setLocalizacion('');
            setTematicaEvento('');
            setDescripcionEnvento('');
            setLocalizacionEvento('');
            setCantidadAsistentes('');
            setFechaEvento('');
            setNombreEmpEvento('');
            setLinksDeReferencia('');
            setRequiereCompraEntradas(false);
            setPrecioEntrada('');
            Alert.alert("evento creado correctamente")
            navigation.navigate("Main");
        } catch (error) {
            console.error('Error al crear el evento:', error);
        }
    };

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                setId(id);
                console.log("El ID del usuario es " + id);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
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
                value={descripcionEnvento}
                onChangeText={setDescripcionEnvento}
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
            <TextInput
                placeholder="Nombre de la Empresa Organizadora"
                value={nombreEmpEvento}
                onChangeText={setNombreEmpEvento}
                style={styles.input}
            />
            <TextInput
                placeholder="Links de Referencia"
                value={linksDeReferencia}
                onChangeText={setLinksDeReferencia}
                style={styles.input}
            />
            <View style={styles.checkboxContainer}>
                <Text>¿Requiere comprar entradas?</Text>
                <Button title={requiereCompraEntradas ? 'Sí' : 'No'} onPress={() => setRequiereCompraEntradas(!requiereCompraEntradas)} />
            </View>
            {requiereCompraEntradas && (
                <TextInput
                    placeholder="Precio de la Entrada"
                    value={precioEntrada}
                    onChangeText={setPrecioEntrada}
                    keyboardType="numeric"
                    style={styles.input}
                />
            )}
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default CreateRoomScreen;
