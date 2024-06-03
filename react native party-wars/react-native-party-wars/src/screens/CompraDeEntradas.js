import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const CompraEntradas = ({ route }) => {
  const { eventoId } = route.params;
  const [cantidadEntradas, setCantidadEntradas] = useState(0);
  const [qrValue, setQrValue] = useState('');
  const [compraRealizada, setCompraRealizada] = useState(false);
  const [eventoInfo, setEventoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const [costoTotal, setCostoTotal] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpDate, setCardExpDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');
  const [id, setId] = useState(0);
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://192.168.1.90:3000/eventos/${eventoId}`);
        const eventData = await response.json();
        setEventoInfo(eventData);
        setPrecioEntrada(eventData.precioEntrada);
        setIsLoading(false);
      } catch (error) {
        ('Error al obtener los datos del evento:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del evento. Por favor, intenta de nuevo.');
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    loadUserData();
    loadEmailData();
    if (precioEntrada !== null) {
      setCostoTotal(cantidadEntradas * precioEntrada);
    }
  }, [cantidadEntradas, precioEntrada]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log(userData);
      if (userData) {
        const { id } = JSON.parse(userData);
        setId(id);
      }
    } catch (error) {
      ('Error al cargar los datos del usuario:', error);
    }
  };

  const loadEmailData = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`);
      const emailData = await response.json();
      setEmail(emailData.email);
    } catch (error) {
      ('Error al cargar el email del usuario:', error);
    }
  };

  const handleCompra = async () => {
    try {
      if (cantidadEntradas <= 0) {
        Alert.alert('Error', 'Por favor, selecciona al menos una entrada.');
        return;
      }

      if (!selectedPaymentMethod) {
        Alert.alert('Error', 'Por favor, selecciona un método de pago.');
        return;
      }

      Alert.alert(
        'Confirmar compra',
        `¿Estás seguro de que quieres comprar ${cantidadEntradas} entradas por ${costoTotal}€?`,
        [
          {
            text: 'Cancelar',
            onPress: () => Alert.alert('Pago cancelado'),
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: async () => {
              setLoadingPayment(true);

              const compraDetails = {
                eventoId,
                cantidadEntradas,
                costoTotal,
                timestamp: new Date().toISOString(),
              };

              await new Promise(resolve => setTimeout(resolve, 1000));

              setQrValue(JSON.stringify(compraDetails));
              setCompraRealizada(true);
              setLoadingPayment(false);

              try {
                const response = await fetch(`http://192.168.1.90:3000/eventos/${eventoId}/comprar`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: email,
                    cantidadEntradas,
                  }),
                });

                if (response.ok) {
                  Alert.alert('Compra realizada', 'La compra se ha realizado con éxito. El correo electrónico ha sido enviado.');
                } else {
                  Alert.alert('Comprueba que tu correo elecotrónico es válido en el apartado de perfil');
                }
              } catch (error) {
                ('Error al enviar el correo electrónico:', error);
                Alert.alert('Error', 'Hubo un problema al enviar el correo electrónico. Por favor, intenta de nuevo.');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      ('Error al realizar la compra:', error.message);
      Alert.alert('Error', 'Hubo un problema al realizar la compra. Por favor, intenta de nuevo.');
      setLoadingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando datos del evento...</Text>
      </View>
    );
  }

  let paymentForm = null;
  if (selectedPaymentMethod === 'card') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={cardName}
          onChangeText={setCardName}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de expiración (MM/YY)"
          value={cardExpDate}
          onChangeText={setCardExpDate}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cardCvv}
          onChangeText={setCardCvv}
        />
      </View>
    );
  } else if (selectedPaymentMethod === 'paypal') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={paypalEmail}
          onChangeText={setPaypalEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={paypalPassword}
          onChangeText={setPaypalPassword}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Compra de <Text style={styles.titleBold}>Entradas</Text></Text>
      </View>
      <LinearGradient
        colors={['#FFDE59', '#FF914D']}
        style={styles.bottomSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {!compraRealizada ? (
          <>
            <View style={styles.eventInfo}>
              <Text style={styles.eventInfoText}>Localización del evento: {eventoInfo.localizacion}</Text>
              <Text style={styles.eventInfoText}> </Text>
              <Text style={styles.eventInfoText}>Fecha del evento: {eventoInfo.fechaEvento}</Text>
              <Text style={styles.eventInfoText}> </Text>

              {precioEntrada && (
                <Text style={styles.eventInfoText}>Precio de la entrada: {precioEntrada}€</Text>
              )}

              <Text style={styles.eventInfoText}>Costo total: {costoTotal}€</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity style={styles.buttonCustom} onPress={() => setCantidadEntradas(Math.max(0, cantidadEntradas - 1))}>
                <Text style={styles.buttonCustomText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{cantidadEntradas}</Text>
              <TouchableOpacity style={styles.buttonCustom} onPress={() => setCantidadEntradas(cantidadEntradas + 1)}>
                <Text style={styles.buttonCustomText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentOptions}>
              <TouchableOpacity style={styles.paymentButton} onPress={() => setSelectedPaymentMethod('card')}>
                <Text style={styles.paymentButtonText}>Pagar con Tarjeta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentButton} onPress={() => setSelectedPaymentMethod('paypal')}>
                <Text style={styles.paymentButtonText}>Pagar con PayPal</Text>
              </TouchableOpacity>
            </View>
            {paymentForm}
            <TouchableOpacity style={styles.buttonContainer} onPress={handleCompra} disabled={loadingPayment}>
              <LinearGradient
                colors={['#313131', '#313131']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Confirmar Pago</Text>
              </LinearGradient>
            </TouchableOpacity>
            {loadingPayment && <ActivityIndicator size="large" color="#0000ff" />}
          </>
        ) : (
          <View style={styles.qrContainer}>
            <QRCode value={qrValue} size={200} />
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Main')}>
              <LinearGradient
                colors={['#313131', '#313131']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Volver a la pantalla principal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
    width: '100%',
    paddingVertical: 20,
  },
  bottomSection: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 3.5,
    width: '100%',
    alignItems: 'center',
    paddingTop: 60,
    marginHorizontal: 25,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
    bottom: -10,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventInfoText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 10,
    color: '#ffffff',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  buttonCustom: {
    backgroundColor: '#313131',
    padding: 10,
    borderRadius: 10,
  },
  buttonCustomText: {
    color: '#ffffff',
    fontSize: 20,
  },
  paymentButton: {
    backgroundColor: '#313131',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  paymentButtonText: {
    color: '#ffffff',
  },

  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#0000ff',
  },
});

export default CompraEntradas;