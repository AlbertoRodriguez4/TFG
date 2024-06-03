import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

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
                setId(id);
            }
        } catch (error) {
        }
    };

    const fetchSalasUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/usuarios/${id}/salas`);
            const data = await response.json();
            setSalas(data);
            guardarIdSalas(data);
        } catch (error) {
        }
    };

    const guardarIdSalas = async (data) => {
        const ids = data.map((sala) => sala.id);
        try {
            await AsyncStorage.setItem('idSalas', JSON.stringify(ids));
            data.forEach((sala) => fetchUsuariosSala(sala.id));
        } catch (error) {
        }
    };

    const fetchUsuariosSala = async (salaId) => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
            const usuarios = await response.json();
            if (usuarios[0] && usuarios[0].id === id) {
                setSalasPrimero((prevState) => [...prevState, salaId]);
            } else {
                setSalasNoPrimero((prevState) => [...prevState, salaId]);
            }
        } catch (error) {
        }
    };

    const fetchEventosUsuario = async () => {
        try {
            const response = await fetch(`http://192.168.1.90:3000/eventos/usuarios/${id}/eventos`);
            const data = await response.json();
            setEventos(data);
        } catch (error) {
        }
    };

    const handleIniciarPartyWars = (salaId) => {
        navigation.navigate('IniciarJuegos', { salaId });
    };

    const handleSalirDeSala = async (salaId) => {
        try {
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
        }
    };

    return (
        <LinearGradient
            colors={['#FFDE59', '#FF914D']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Salas del Usuario</Text>

            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                                <Text style={styles.startButtonText}>Iniciar Party Wars 🎉</Text>
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 40,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#313131',
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    headerTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    salaContainer: {
        top: 20,
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        backgroundColor: '#313131',
        elevation: 3,
    },
    salaNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    salaDescripcion: {
        fontSize: 16,
        marginBottom: 10,
        color: '#fff',
    },
    salaTematica: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    salaEdades: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    salaLocalizacion: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    salaParticipantes: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    salaFecha: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
    },
    eventoContainer: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        backgroundColor: '#313131',
        elevation: 3,
    },
    eventoNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    eventoDescripcion: {
        fontSize: 16,
        marginBottom: 10,
        color: '#fff',
    },
    eventoFecha: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
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
    title: {
        top: 10,
        paddingBottom: 10,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
});

export default SalasUsuario;