import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import { FlatList, View, Text, SafeAreaView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';



export default function FeaturedCategory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fail, setFailure] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1);
    const [pickerValue, setPickerValue] = useState("new");
    const items = [
        { label: 'New arrivals', value: 'new' },
        { label: 'Price, Lowest', value: 'priceLow' },
        { label: 'Price, Highest', value: 'priceHigh' },
      ];
    // dropdown state
    const [open, setOpen] = useState(false);


    const sortedProducts = useMemo(() => {
        const sortedCopy = [...products]
        switch(pickerValue){
            case "new":
                return sortedCopy.sort((p1, p2) => p1.id - p2.id)
            case "priceLow":
                return sortedCopy.sort((p1, p2) =>  p1.price - p2.price)
            case "priceHigh":
               return  sortedCopy.sort((p1, p2) => p2.price - p1.price)
            default:
                return products

        }
            
    }, [products, pickerValue])


    // Pagination 
    const itemsPerPage = 5;
    const maxPage = products.length / itemsPerPage
    const paginatedProducts = sortedProducts.slice(
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
            ListFooterComponent={
                maxPage > 0 ? (
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
                                key={n}
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
                ) : null
            }  
            ListHeaderComponent={
                maxPage > 0 ? (
                    <DropDownPicker
                        style={styles.dropDown}
                        open={open}
                        value={pickerValue}
                        items={items}
                        setValue={setPickerValue}
                        placeholder={pickerValue}
                        setOpen={setOpen}
                        listMode="MODAL"
                        textStyle={{ fontSize: 12 }}
                       />
                ) : null
            }

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
        opacity: 0.3,},
        
      dropDown: {
            width: "37%",
            alignSelf: "flex-end",
            minHeight: 32,
            marginRight: 16, 
            marginTop: 50,
            borderRadius: 5,
            borderColor: "grey"
          },
}
)