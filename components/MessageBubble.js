// components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isSender }) {
    return (
        <View
            style={[
                styles.messageBubble,
                isSender ? styles.senderBubble : styles.receiverBubble,
            ]}
        >
            <Text style={{ color: isSender ? 'white' : 'black' }}>{message.text}</Text>
            <Text style={styles.timestamp}>
                {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    messageBubble: {
        marginVertical: 5,
        maxWidth: '75%',
        padding: 10,
        borderRadius: 10,
    },
    senderBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 0,
    },
    receiverBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
        borderBottomLeftRadius: 0,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        color: 'gray',
        alignSelf: 'flex-end',
    },
});
