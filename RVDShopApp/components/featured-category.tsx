import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import { FlatList, View, Text, SafeAreaView, Image } from 'react-native';

export default function FeaturedCategory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fail, setFailure] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);

    async function loadProducts(refresh = false) {
        try{
            if (refresh) {
                setRefresh(true)
            } else {
                setLoading(true)  
            }
            const response = await fetch("https://fakestoreapi.com/products")
            const data = await response.json()
            setProducts(data)
        }
        catch {
            setFailure("Network error")

        } finally {
            setLoading(false)
            setRefresh(false)
        }
    }

    useEffect(() => {
        loadProducts(false)
    }, [])

    const onRefresh = useCallback(() => {
        loadProducts(true);
    }, [loadProducts])

    if (loading) {
        return <ActivityIndicator size="large"/>;
    }
    if (fail) {
        return <Text>{"Network Error"}</Text>
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList 
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{uri: item.image}} style={styles.image} resizeMode='contain'/>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
                
              )}
            refreshing={refresh}
            onRefresh={onRefresh}  
            />
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        
    },
    title: {
        marginTop: 8,
        fontWeight: "600",
    },

    price: {
        marginTop: 4
    },
    image: {
        width: "100%",
        height: 150
    }
}

)