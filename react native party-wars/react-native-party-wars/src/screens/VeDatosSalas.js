import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const VeDatosSalas = ({ route, navigation }) => {
  const [juegos, setJuegos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isUserInRoom, setIsUserInRoom] = useState(false);
  const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
  const [salaId, setSalaId] = useState(null);
  const [datosSala, setDatosSala] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { salaId: idFromParams } = route.params;
        setSalaId(idFromParams);

        const juegosResponse = await fetch(`http://192.168.1.90:3000/salas/${idFromParams}/juegos`);
        const juegosData = await juegosResponse.json();
        setJuegos(juegosData);

        const usuariosResponse = await fetch(`http://192.168.1.90:3000/salas/${idFromParams}/usuarios`);
        const usuariosData = await usuariosResponse.json();

        const datosSalasResponse = await fetch(`http://192.168.1.90:3000/salas/${idFromParams}`);
        const datosSalaData = await datosSalasResponse.json();

        setDatosSala(datosSalaData);
        const numeroParticipantes = datosSalaData.numeroParticipantes;
        setEspaciosDisponibles(numeroParticipantes - usuariosData.length);

        const userEmail = await AsyncStorage.getItem('id');
        console.log("id del usuario" + 	usuarioId);
        const isUserInRoom = usuariosData.some(user => user.id === usuarioId);
        setIsUserInRoom(isUserInRoom);

        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al cargar los datos de la sala:', error);
      }
    };

    fetchData();
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUserData(JSON.parse(userData));
        const { id } = JSON.parse(userData);
        setUsuarioId(id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleJoinParty = async () => {
    if (espaciosDisponibles <= 0) {
      Alert.alert('Error', 'No hay espacios disponibles en esta sala');
      return;
    }
    try {
      const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios/${userData.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido a la fiesta correctamente');
        setIsUserInRoom(true);
        setEspaciosDisponibles(prev => prev - 1);
      } else {
        throw new Error('Error al unirse a la fiesta');
      }
    } catch (error) {
      console.error('Error al unirse a la fiesta:', error);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/izquierda.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sala de Party Wars</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/hogar.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/mono-business.jpg')} style={styles.mainImage} />

      {datosSala && (
        <Text style={styles.subTitle}>Sala {datosSala.numeroParticipantes - espaciosDisponibles}/{datosSala.numeroParticipantes} Personas</Text>
      )}

      <Text style={styles.subTitle}>Usuarios</Text>
      <FlatList
        data={usuarios}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            {item.urlImagen ? (
              <Image source={{ uri: item.urlImagen }} style={styles.userImage} />
            ) : (
              <Image source={require('../assets/perfil.png')} style={styles.userImage} />
            )}
            <Text style={styles.userName}>{item.nome}</Text>
            <Text style={styles.userDescription}>{item.descripcionPersonal}</Text>
          </View>
        )}
        contentContainerStyle={styles.userList}
      />
      <Text style={styles.subTitle}>Juegos</Text>
    </View>
  );

  const renderFooter = () => (
    <View>
      {espaciosDisponibles > 0 && !isUserInRoom && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinParty}
        >
          <Text style={styles.joinButtonText}>Unirse a la fiesta</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={juegos}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameTitle}>{item.nombre}</Text>
            <Text style={styles.gameCategory}>{item.categoriaJuego}</Text>
          </View>
          <Text style={styles.gameProperty}>{item.propiedadJuego}</Text>
          <Text style={styles.gameDescription}>{item.descripcionJuego}</Text>
          <Text style={styles.gameRules}>{item.normasJuego}</Text>
        </View>
      )}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  userList: {
    paddingVertical: 10,
  },
  userCard: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDescription: {
    textAlign: 'center',
  },
  gameCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    elevation: 0,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameCategory: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  gameProperty: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  gameDescription: {
    fontSize: 14,
    marginVertical: 5,
  },
  gameRules: {
    fontSize: 12,
    color: '#888',
  },
  joinButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 100,
  },
});

export default VeDatosSalas;
