import { useEffect, useState } from 'react';

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
                // fetch logic        
            }
        }
        catch {
            setFailure("Network error")

        } finally {
            setLoading(false)
        }


    }

    useEffect(() => {

    }, [])

    useEffect(() => {

    }, [products])


    useEffect(() => {

    }, [loading])

    useEffect(() => {
         
    }, [fail])
    useEffect(() => {
        
    }, [refresh])

}