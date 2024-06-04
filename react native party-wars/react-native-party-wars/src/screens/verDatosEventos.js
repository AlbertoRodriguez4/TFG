import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button, Image, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
    }
    navigation.navigate("CompraDeEntradas", { eventoId: eventoId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Detalles del <Text style={styles.titleBold}>Evento</Text></Text>
      </View>
      <LinearGradient
        colors={['#FFDE59', '#FF914D']}
        style={styles.bottomSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Sección de eventos */}
        {evento && (
          <>
            <Text style={styles.sectionTitle}>Detalles del Evento</Text>
            <FlatList
              data={[evento]}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.textBold}>Nombre de la Sala: {item.nombreSala || 'Nombre no disponible'}</Text>
                  <Text style={styles.textBold}>Edad Mínima del Evento: {item.edadMinEvento}</Text>
                  <Text style={styles.textBold}>Edad Máxima del Evento: {item.edadMaxEvento}</Text>
                  <Text style={styles.textBold}>Localización: {item.localizacion}</Text>
                  <Text style={styles.textBold}>Temática del Evento: {item.tematicaEvento}</Text>
                  <Text style={styles.textBold}>Descripción del Evento: {item.descripcionEnvento}</Text>
                  <Text style={styles.textBold}>Localización del Evento: {item.localizacionEvento}</Text>
                  <Text style={styles.textBold}>Cantidad de Asistentes: {item.cantidadAsistentes}</Text>
                  <Text style={styles.textBold}>Fecha del Evento: {item.fechaEvento}</Text>
                  <Text style={styles.textBold}>Nombre de la Empresa Organizadora: {item.nombreEmpEvento}</Text>
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
              <Text style={styles.textBold}>Nombre: {item.nome}</Text>
              <Text style={styles.textBold}>Email: {item.email}</Text>
              <Text style={styles.textBold}>Plan: {item.plan}</Text>
              <Text style={styles.textBold}>Descripción Personal: {item.descripcionPersonal}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Mostrar el botón solo si el usuario no está en el evento y si hay datos del usuario */}
        {valor === 0 && userData && (
          <TouchableOpacity style={styles.buttonContainer} onPress={handleJoinEvent}>
            <LinearGradient
              colors={['#313131', '#313131']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Unirse al evento</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313131',
  },
  textBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
    width: '100%',
  },
  bottomSection: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 5,
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 0,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '90%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#ffffff',
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#313131',
    borderRadius: 5,
    width: '90%',
  },
  infoTitle: {
    color: '#ffffff',

    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '80%',
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default VeDatosSalas;