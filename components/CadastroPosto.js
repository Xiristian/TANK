import { useState, useEffect } from "react";

import {
    StyleSheet,
    Keyboard,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";

import { TextInput, Button, Dialog, Portal } from "react-native-paper";
import { executeSql } from "../db";

export default function CadastroPosto({ navigation, route }) {
    const [enderecoPosto, setEnderecoPosto] = useState('');
    const [infoPosto, setInfoPosto] = useState('');
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('ERROS');
    const [erro, setErro] = useState('');

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const salvar = async () => {
        if (route.params?.id) {
            await updateBD()
        } else {
            await salvarBD()
        }
        showDialog()
    }

    const salvarBD = async () => {
        try {
            const { insertId = null } = await executeSql("INSERT INTO posto (endereco, informacoes) VALUES(?, ?)", [
                enderecoPosto,
                infoPosto,
            ]);
            setErro('')
            setStatus('SUCESSO')
        } catch (err) {
            setErro('Erro ao salvar informações!')
            setStatus('ERROS')
        }
    }

    const updateBD = async () => {
        try {
            const { insertId = null } = await executeSql("UPDATE posto set endereco = ?, informacoes = ? where id = ?", [
                enderecoPosto,
                infoPosto,
                route.params?.id
            ]);
            pesquisaPosto();
            setErro('');
            setStatus('SUCESSO');
        } catch (err) {
            setErro('Erro ao ataulizar informações!');
            setStatus('ERROS');
            console.log(err)
        }
    }

    const pesquisaPosto = async () => {
        try {
            await executeSql("select * from posto where id = ?", [route.params?.id]).then((rows) => {
                rows.rows._array.map((posto) => {
                    setEnderecoPosto(posto.endereco);
                    setInfoPosto(posto.informacoes);
                })
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    const insereEndereco = () => {
        setEnderecoPosto(route.params?.endereco);
    }

    useEffect(() => {
        if (route.params?.id) {
            pesquisaPosto();
        }
    }, [route.params?.id]);

    useEffect(() => {
        if (route.params?.endereco) {
            insereEndereco();
        }
    }, [route.params?.endereco]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.formContainer}>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>ENVIADO COM {status}</Dialog.Title>
                            {erro ?
                                (<Dialog.Content>
                                    <Text>{erro}</Text>
                                </Dialog.Content>) : null}
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <TextInput
                        autoCorrect={false}
                        label="Endereço do posto..."
                        value={enderecoPosto}
                        onChangeText={texto => setEnderecoPosto(texto)}
                        style={[styles.textInput]}
                        mode="outlined"
                    />
                    <TextInput
                        autoCorrect={true}
                        label="Informações sobre o posto..."
                        value={infoPosto}
                        multiline={true}
                        style={[styles.textInput, { height: 230 }]}
                        onChangeText={texto => setInfoPosto(texto)}
                        mode="outlined"
                    />
                    <Button onPress={() => {
                        salvar();
                        Keyboard.dismiss();
                    }}
                        mode="contained" style={{ marginTop: 16, width: '40%' }}>
                        ENVIAR
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