import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import { FlatList, View, Text, SafeAreaView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import PaginationControls from './paginated-products';




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
    const paginatedProducts = paginateProducts(sortedProducts, page, itemsPerPage)
    const pageContainer = paginateContainer(products, page)

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
                    PaginationControls(maxPage, page, pageContainer, setPage)
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


export function paginateProducts(
    products: any[],
    page: number,
    itemsPerPage: number

) {

    const paginatedProducts = products.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    )

    return paginatedProducts

}

export function paginateContainer(
    products: any[],
    page: number
) {
    const itemsPerPage = 5;
    const pageIndex = Math.floor((page - 1) / itemsPerPage)
    const maxPage = products.length / itemsPerPage
    const start = pageIndex * itemsPerPage + 1
    const end = Math.min(start + itemsPerPage - 1, maxPage)

    const pageContainer = []
    for (let i = start; i <= end; i++) {
        pageContainer.push(i)
    }
    return pageContainer

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