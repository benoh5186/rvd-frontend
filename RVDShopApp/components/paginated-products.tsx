import React from "react";
import { View, Text, StyleSheet } from "react-native";



export default function PaginationControls(
    maxPage: number,
    page: number,
    pageContainer: number[],
    setPage: React.Dispatch<React.SetStateAction<number>>
) {
    return (                     
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
        
    )


}

const styles = StyleSheet.create( {
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
        opacity: 0.3,}
}
    
)