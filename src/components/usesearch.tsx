"use client"

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Product } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from 'next/navigation'



const getProduct = cache((id: string) => {
    return db.product.findUnique({
        where: {
            id: id,
        },
    })
}, ["/", "getProduct"], { revalidate: 60 * 60 * 24 })

export default function ProductItem() {
    // "use client"
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';

    return (
        <main>
            <ProductSection
                title="Product"
                getProduct={getProduct}
                id={id}
            />
        </main>
    )
}


type ProductSectionProps = {
    title: string
    getProduct: (id: string) => Promise<Product | null>
    id: string;
}

function ProductSection({
    getProduct,
    title,
    id,
}: ProductSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button variant="outline" asChild>
                    <Link href="/projects" className="space-x-2">
                        <span>View All</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense
                    fallback={
                        <>
                            <ProductCardSkeleton />
                        </>
                    }
                >
                    <ProductSuspense getProduct={getProduct} id={id} />
                </Suspense>
            </div>
        </div>
    )
}

async function ProductSuspense({
    getProduct,
    id,
}: {
    getProduct: (id: string) => Promise<Product | null>
    id: string;
}) {
    const product = await getProduct(id);
    return product ? <ProductCard key={product.id} {...product} /> : null;
}
