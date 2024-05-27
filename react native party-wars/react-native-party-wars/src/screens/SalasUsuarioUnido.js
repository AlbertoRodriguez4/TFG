import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SalasUsuario = ({ route }) => {
    const [salas, setSalas] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [id, setId] = useState(0);
    const [salasPrimero, setSalasPrimero] = useState([]);
    const [salasNoPrimero, setSalasNoPrimero] = useState([]);
    const [currentDay, setCurrentDay] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        loadUserData();
        setCurrentDay(new Date().toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (id !== 0) {
            fetchSalasUsuario();
            fetchEventosUsuario();
        }
    }, [id]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id } = JSON.parse(userData);
                console.log(id);
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
        const ids = data.map((sala) => sala.id);
        try {
            await AsyncStorage.setItem('idSalas', JSON.stringify(ids));
            data.forEach((sala) => fetchUsuariosSala(sala.id));
        } catch (error) {
            console.error('Error al guardar el ID de las salas:', error);
        }
    };

    const fetchUsuariosSala = async (salaId) => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
            const usuarios = await response.json();
            console.log(currentDay);
            if (usuarios[0] && usuarios[0].id === id) {
                setSalasPrimero((prevState) => [...prevState, salaId]);
            } else {
                setSalasNoPrimero((prevState) => [...prevState, salaId]);
            }

            if (usuarios[0] && usuarios[0].id === id) {
                console.log(`Soy primero en la sala ${salaId}`);
            } else {
                console.log(`No soy primero en la sala ${salaId}`);
            }
        } catch (error) {
            console.error('Error al obtener los usuarios de la sala:', error);
        }
    };

    const fetchEventosUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/eventos/usuarios/${id}/eventos`);
            const data = await response.json();
            console.log(data);
            setEventos(data);
        } catch (error) {
            console.error('Error al obtener los eventos del usuario:', error);
        }
    };

    const handleIniciarPartyWars = (salaId) => {
        navigation.navigate('IniciarJuegos', { salaId });
    };

    const handleSalirDeSala = async (salaId) => {
        try {
            console.log(salaId, id);
            const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchSalasUsuario();
                Alert.alert('Salida exitosa', 'Te has salido de la sala de forma correcta.');
            } else {
                Alert.alert('Error', 'No se pudo salir de la sala.');
            }
        } catch (error) {
            console.error('Error al salir de la sala:', error);
            Alert.alert('Error', 'No se pudo salir de la sala.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/izquierda.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Salas del Usuario</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assets/hogar.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>

            {salas.map((sala) => (
                <View key={sala.id} style={styles.salaContainer}>
                    <Text style={styles.salaNombre}>{sala.nombre}</Text>
                    <Text style={styles.salaDescripcion}>{sala.descripcion}</Text>
                    <Text style={styles.salaTematica}>Temática: {sala.tematicaSala}</Text>
                    <Text style={styles.salaEdades}>Edad mínima: {sala.edadMinima} - Edad máxima: {sala.edadMaxima}</Text>
                    <Text style={styles.salaLocalizacion}>Localización: {sala.localizacionSala}</Text>
                    <Text style={styles.salaParticipantes}>Participantes: {sala.numeroParticipantes}</Text>
                    <Text style={styles.salaFecha}>Fecha: {sala.fecha ? sala.fecha.split('T')[0] : 'Fecha no disponible'}</Text>

                    {(salasPrimero.includes(sala.id) && sala.fecha && sala.fecha.split('T')[0] === currentDay) && (
                        <TouchableOpacity style={styles.startButton} onPress={() => handleIniciarPartyWars(sala.id)}>
                            <Text style={styles.startButtonText}>Iniciar Party Wars</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.leaveButton} onPress={() => handleSalirDeSala(sala.id)}>
                        <Text style={styles.leaveButtonText}>Salir de la Sala</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <Text style={styles.title}>Eventos del Usuario</Text>
            {eventos.map((evento) => (
                <View key={evento.id} style={styles.eventoContainer}>
                    <Text style={styles.eventoNombre}>{evento.nombreSala}</Text>
                    <Text style={styles.eventoDescripcion}>{evento.descripcionEnvento}</Text>
                    <Text style={styles.eventoFecha}>Fecha: {evento.fechaEvento.split('T')[0]}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#000',
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
        backgroundColor: '#fff',
        elevation: 3,
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
    salaFecha: {
        fontSize: 16,
        marginBottom: 5,
    },
    eventoContainer: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    eventoNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    eventoDescripcion: {
        fontSize: 16,
        marginBottom: 10,
    },
    eventoFecha: {
        fontSize: 16,
        marginBottom: 5,
    },
    startButton: {
        backgroundColor: '#FFA726',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    leaveButton: {
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    leaveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SalasUsuario;
