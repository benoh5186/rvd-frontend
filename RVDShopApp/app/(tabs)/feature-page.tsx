import React from "react";
import {View, StyleSheet} from "react-native";
import FeaturedCategory from "@/components/featured-category";

export default function FeaturedPage() {
    return (
        <View style={styles.container}>
            <FeaturedCategory/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
  });