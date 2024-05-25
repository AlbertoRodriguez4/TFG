import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VeDatosSalas = ({ route, navigation }) => {
  const [evento, setEvento] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isUserInRoom, setIsUserInRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [valor, setValor] = useState(0);
  const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
  const [eventoId, setEventoId] = useState(null); // Nueva variable de estado para almacenar el eventoId

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadUserData();

        const { eventoId: idFromParams } = route.params; // Obtener el ID del evento del parámetro de ruta
        setEventoId(idFromParams); // Guardar el eventoId en la variable de estado
        console.log(idFromParams);

        // Obtener datos del evento
        const eventosResponse = await fetch(`http://192.168.1.90:3000/eventos/${idFromParams}`);
        const eventosData = await eventosResponse.json();
        
        if (!eventosData || typeof eventosData !== 'object') {
          throw new Error('La respuesta de los datos del evento no es válida');
        }

        // Obtener usuarios del evento
        const usuariosResponse = await fetch(`http://192.168.1.90:3000/eventos/${idFromParams}/usuarios`);
        const usuariosData = await usuariosResponse.json();
        
        if (!Array.isArray(usuariosData)) {
          throw new Error('La respuesta de los datos de usuarios no es un array');
        }

        const userIds = usuariosData.map(user => user.id);
        console.log("Cantidad de usuarios: " + usuariosData.length);

        // Calcular la cantidad de espacios disponibles restando la cantidad de usuarios actuales del límite máximo de asistentes
        const espaciosDisponibles = eventosData.cantidadAsistentes - usuariosData.length;
        setEspaciosDisponibles(espaciosDisponibles);

        // Establecer los datos de eventos y usuarios por separado
        setEvento(eventosData);  // Eventos data is assumed to be a single object
        setUsuarios(usuariosData);

        // Verificar si el usuario está presente en el evento
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          if (userIds.includes(parsedUserData.id)) {
            setIsLoading(false);
            setIsUserInRoom(true);
            setValor(1);
          } else {
            setIsUserInRoom(false);
            setValor(0);
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos del evento:', error.message);
      }
    };

    fetchData();
  }, [route.params]);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error.message);
    }
  };

  const handleJoinEvent = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/eventos/${eventoId}/usuarios/${userData.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido al evento correctamente');
        setIsUserInRoom(true);
        navigation.navigate("Main");
      } else {
        throw new Error('Error al unirse al evento');
      }
    } catch (error) {
      console.error('Error al unirse al evento:', error.message);
    }
    navigation.navigate("CompraDeEntradas", { eventoId: eventoId });
  };

  return (
    <View style={styles.container}>
      {/* Sección de eventos */}
      {evento && (
        <>
          <Text style={styles.sectionTitle}>Detalles del Evento</Text>
          <FlatList
            data={[evento]}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>Nombre de la Sala: {item.nombreSala || 'Nombre no disponible'}</Text>
                <Text>Edad Mínima del Evento: {item.edadMinEvento}</Text>
                <Text>Edad Máxima del Evento: {item.edadMaxEvento}</Text>
                <Text>Localización: {item.localizacion}</Text>
                <Text>Temática del Evento: {item.tematicaEvento}</Text>
                <Text>Descripción del Evento: {item.descripcionEnvento}</Text>
                <Text>Localización del Evento: {item.localizacionEvento}</Text>
                <Text>Cantidad de Asistentes: {item.cantidadAsistentes}</Text>
                <Text>Fecha del Evento: {item.fechaEvento}</Text>
                <Text>Nombre de la Empresa Organizadora: {item.nombreEmpEvento}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Links de referencia:</Text>
            <Text style={styles.infoText}>{evento.linksDeReferencia || 'No disponible'}</Text>
            <Text style={styles.infoTitle}>Espacios disponibles:</Text>
            <Text style={styles.infoText}>{espaciosDisponibles}</Text>
          </View>
        </>
      )}

      {/* Sección de usuarios */}
      <Text style={styles.sectionTitle}>Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <View style={styles.item}>
              <Image source={{ uri: item.urlImagen }} style={styles.image} />
            <Text>Nombre: {item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Plan: {item.plan}</Text>
            <Text>Descripción Personal: {item.descripcionPersonal}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Mostrar el botón solo si el usuario no está en el evento y si hay datos del usuario */}
      {valor === 0 && userData && (
        <Button title="Unirse al evento" onPress={handleJoinEvent} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius:  5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderRadius: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default VeDatosSalas;

