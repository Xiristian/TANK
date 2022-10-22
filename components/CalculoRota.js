import { useState, useEffect } from "react";

import {
    StyleSheet,
    Keyboard,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { TextInput, Button, Dialog, Portal } from "react-native-paper";

export default function CalculoRota({ navigation }) {
    const [enderecoPartida, setEnderecoPartida] = useState('');
    const [enderecoDestino, setEnderecoDestino] = useState('');
    const [visible, setVisible] = useState(false);
    const [acessos, setAcessos] = useState(0);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const calcularRota = () => {
        setAcessos(acessos + 1);
        if (acessos == 3) {
            showDialog();
        }
    }

    useEffect(() => {
        setAcessos(0);
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.formContainer}>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog} style={{ alignItems: "center" }}>
                            <Dialog.Title>LIMITE DE ACESSO EXCEDIDO!</Dialog.Title>
                            <Dialog.Actions>
                                <Button onPress={() => { hideDialog(); navigation.navigate("Premium") }}>Utilizar recurso premium?</Button>
                                <Button onPress={hideDialog}>SAIR</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <TextInput
                        autoCorrect={false}
                        label="Endereço de partida..."
                        value={enderecoPartida}
                        onChangeText={texto => setEnderecoPartida(texto)}
                        style={[styles.textInput]}
                        mode="outlined"
                    />
                    <TextInput
                        autoCorrect={true}
                        label="Endereço de destino..."
                        value={enderecoDestino}
                        style={[styles.textInput]}
                        onChangeText={texto => setEnderecoDestino(texto)}
                        mode="outlined"
                    />
                    <Button onPress={() => {
                        calcularRota();
                        Keyboard.dismiss();
                    }}
                        mode="contained" style={{ marginTop: 16, width: '40%' }}>
                        CALCULAR
                    </Button>
                </View>
            </TouchableWithoutFeedback >
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        alignItems: 'center',
    },
    textInput: {
        width: '90%',
        marginTop: 6,
    },
});