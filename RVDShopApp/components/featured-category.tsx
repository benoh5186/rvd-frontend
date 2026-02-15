import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList, View, Text} from 'react-native-reanimated/lib/typescript/Animated';

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
        <View style={{ flex: 1 }}>
            <FlatList 
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <Text>{item.title}</Text>}
            refreshing={refresh}
            onRefresh={onRefresh}  
            />
        </View>
    )


}