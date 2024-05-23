import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const CompraEntradas = ({ route, navigation }) => {
  const { eventoId } = route.params;
  const [cantidadEntradas, setCantidadEntradas] = useState(0); // Cambiado a número
  const [qrValue, setQrValue] = useState('');
  const [compraRealizada, setCompraRealizada] = useState(false);
  const [eventoInfo, setEventoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [precioEntrada, setPrecioEntrada] = useState(null);
  const [costoTotal, setCostoTotal] = useState(0); // Inicializado a 0
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
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://192.168.1.90:3000/eventos/${eventoId}`);
        const eventData = await response.json();
        setEventoInfo(eventData);
        setPrecioEntrada(eventData.precioEntrada);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del evento:', error);
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
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const loadEmailData = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`);
      const emailData = await response.json();
      setEmail(emailData.email);
  } catch (error) {
  }
}
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
                    email: email, // Reemplaza con el correo electrónico del usuario
                    cantidadEntradas 
                  }),
                });

                if (response.ok) {
                  Alert.alert('Compra realizada', 'La compra se ha realizado con éxito. El correo electrónico ha sido enviado.');
                } else {
                  throw new Error('Error al enviar el correo electrónico');
                }
              } catch (error) {
                console.error('Error al enviar el correo electrónico:', error);
                Alert.alert('Error', 'Hubo un problema al enviar el correo electrónico. Por favor, intenta de nuevo.');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al realizar la compra:', error.message);
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
      {!compraRealizada ? (
        <>
          <Text style={styles.title}>Compra de Entradas</Text>
          <View style={styles.eventInfo}>
            <Text style={styles.eventInfoText}>Localización del evento: {eventoInfo.localizacion}</Text>
            <Text style={styles.eventInfoText}>Fecha del evento: {eventoInfo.fechaEvento}</Text>
            {precioEntrada && (
              <Text style={styles.eventInfoText}>Precio de la entrada: {precioEntrada}€</Text>
            )}
            <Text style={styles.eventInfoText}>Costo total: {costoTotal}€</Text>
          </View>
          <View style={styles.counterContainer}>
            <Button title="-" onPress={() => setCantidadEntradas(Math.max(0, cantidadEntradas - 1))} />
            <Text style={styles.counterText}>{cantidadEntradas}</Text>
            <Button title="+" onPress={() => setCantidadEntradas(cantidadEntradas + 1)} />
          </View>
          <View style={styles.paymentOptions}>
            <Button title="Pagar con Tarjeta" onPress={() => setSelectedPaymentMethod('card')} />
            <Button title="Pagar con PayPal" onPress={() => setSelectedPaymentMethod('paypal')} />
          </View>
          {paymentForm}
          <Button title="Confirmar Pago" onPress={handleCompra} disabled={loadingPayment} />
          {loadingPayment && <Text style={styles.loadingText}>Realizando pago...</Text>}
        </>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.title}>Entrada Comprada</Text>
          <QRCode value={qrValue} size={200} />
          <Text style={styles.qrText}>QR que habrá que enseñar en la entrada</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventInfoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '50%',
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default CompraEntradas;
