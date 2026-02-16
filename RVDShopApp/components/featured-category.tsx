import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import { FlatList, View, Text, SafeAreaView, Image } from 'react-native';

export default function FeaturedCategory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fail, setFailure] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1);


    // Pagination 
    const itemsPerPage = 5;
    const maxPage = products.length / itemsPerPage
    const paginatedProducts = products.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    )
    const pageIndex = Math.floor((page - 1) / itemsPerPage)
    const start = pageIndex * itemsPerPage + 1
    const end = Math.min(start + itemsPerPage - 1, maxPage)

    const pageContainer = []
    for (let i = start; i <= end; i++) {
        pageContainer.push(i)
    }

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
            data={paginatedProducts}
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
            <View style={styles.pagination}>
                <Text
                style={[styles.navBtn, page === 1 && styles.disabled]}
                onPress={() => setPage(1)}  
                >
                    {"<<"}
                </Text>
                <Text style={[styles.navBtn, page === 1 && styles.disabled]} onPress={() => setPage(p => (
                    Math.max(1, (p - 1))
                ))}>{"<Prev"}</Text>
                <View style={styles.pageRow}>
                    {pageContainer.map((n) => (
                        <Text 
                            onPress={() => setPage(n)}
                            style={[styles.pageBtn, n === page && styles.pageBtnActive]}
                            >{n}
                            </Text>
                    ))}
                </View>

                <Text
                    style={[styles.navBtn, page === maxPage && styles.disabled]}
                    onPress={() => setPage(p => {
                    if ((p + 1) > maxPage) {
                        return p
                    } else {   
                        return p + 1
                    }
                }
            
                )}>{"Next>"}</Text>
                <Text
                style={[styles.navBtn, page === maxPage && styles.disabled]}
                onPress={() => setPage(maxPage)}  
                >
                    {">>"}
                </Text>
            </View>

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
    },

    pagination: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      
      pageRow: {
        flexDirection: "row",
        gap: 10, 
      },
      
      pageBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ddd",
      },
      
      pageBtnActive: {
        borderColor: "#333",
        fontWeight: "700",
      },
      
      navBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontWeight: "600",
      },
      
      disabled: {
        opacity: 0.3,
      },
}

)