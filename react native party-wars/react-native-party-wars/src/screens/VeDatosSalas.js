import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, TextInput, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const VeDatosSalas = ({ route }) => {
  const navigation = useNavigation();
  const [juegos, setJuegos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isUserInRoom, setIsUserInRoom] = useState(false);
  const [espaciosDisponibles, setEspaciosDisponibles] = useState(0);
  const [salaId, setSalaId] = useState(null);
  const [datosSala, setDatosSala] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadUserData();

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

        const isUserInRoom = usuariosData.some(user => user.id === usuarioId);
        setIsUserInRoom(isUserInRoom);

        setUsuarios(usuariosData);
      } catch (error) {

      }
    };

    fetchData();
  }, [route.params]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUserData(JSON.parse(userData));
        const { id } = JSON.parse(userData);
        setUsuarioId(id);
      }
    } catch (error) {

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
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const fetchData = async () => {
      try {
        const juegosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos`);
        const juegosData = await juegosResponse.json();
        setJuegos(juegosData);

        const usuariosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
        const usuariosData = await usuariosResponse.json();

        const datosSalasResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}`);
        const datosSalaData = await datosSalasResponse.json();

        setDatosSala(datosSalaData);
        const numeroParticipantes = datosSalaData.numeroParticipantes;
        setEspaciosDisponibles(numeroParticipantes - usuariosData.length);

        const userEmail = await AsyncStorage.getItem('id');

        const isUserInRoom = usuariosData.some(user => user.id === usuarioId);
        setIsUserInRoom(isUserInRoom);

        setUsuarios(usuariosData);
      } catch (error) {

      }
    };
    fetchData();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topSection}>
        <Text style={styles.title}>Detalles de la Sala</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/perfil.png')}
            style={styles.profileIcon}
          />
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
          <LinearGradient
            colors={['#FFDE59', '#FF914D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.joinButtonGradient}
          >
            <Text style={styles.joinButtonText}>Unirse a la fiesta</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderGameCard = ({ item }) => (
    <View style={styles.gameCard}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>{item.nombre}</Text>
        <Text style={styles.gameCategory}>{item.categoriaJuego}</Text>
      </View>
      <Text style={styles.gameProperty}>{item.propiedadJuego}</Text>
      <Text style={styles.gameDescription}>{item.descripcionJuego}</Text>
      <Text style={styles.gameRules}>{item.normasJuego}</Text>
    </View>
  );

  return (
    <FlatList
      data={juegos}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={renderGameCard}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF4',
  },
  topSection: {
    backgroundColor: '#313131',
    width: '100%',
    paddingVertical: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
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
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameCategory: {
    fontSize: 16,
    color: '#666',
  },
  gameProperty: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  gameDescription: {
    marginTop: 10,
  },
  gameRules: {
    marginTop: 10,
    color: '#555',
  },
  joinButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  joinButtonGradient: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profileIcon: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: -20,
    right: 0,
  },
});

export default VeDatosSalas;
