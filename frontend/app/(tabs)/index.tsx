import React from "react";
import { View, FlatList } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import TabsNavigator from "./TabsNavigator";

export function Home() {
    return <TabsNavigator />;
}

const PushApp = () => {


    return (
        <View style={{ marginHorizontal: 10, marginTop: 5 }}>
            <ThemedText
                style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    fontSize: 25,
                }}
            >
                Notificaciones
            </ThemedText>

            {/* <FlatList
                //data={notifications}
                keyExtractor={(item) => item.request.identifier}
                renderItem={({ item }) => (
                    <View>
                        <ThemedText style={{ fontWeight: 'bold' }}>
                            {item.request.content.title}
                        </ThemedText>
                        <ThemedText>{item.request.content.body}</ThemedText>
                        <ThemedText>
                            {JSON.stringify(item.request.content.data, null, 2)}
                        </ThemedText>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'grey', opacity: 0.3 }} />
                )}
            /> */}
        </View>
    );
};

export default Home;
export { PushApp };

