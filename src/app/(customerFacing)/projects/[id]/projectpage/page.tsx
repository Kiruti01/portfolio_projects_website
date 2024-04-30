import db from '@/db/db';
import { ProductCard } from '@/components/ProductCard Id';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      // priceInCents: true,
      description: true,
      imagePath: true,
      projectLink: true, // Include projectLink in the product data
      demoLink: true, // Include demoLink in the product data
    },
  });

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <>
      <ProductCard
        id={product.id}
        name={product.name}
        // priceInCents={product.priceInCents}
        description={product.description}
        imagePath={product.imagePath}
      />
      <div className='space-y-2 flex-col items-center'>

        {product.projectLink && (
          <Button asChild size="lg" className="w-full">
            <Link href={product.projectLink}>Go to project</Link>
          </Button>
        )}

        {product.demoLink && (
          <Button asChild variant="outline" size="lg" className="w-full bg-[#8093ff] hover:bg-[#343697]">
            <Link href={product.demoLink}>Demo</Link>
          </Button>
        )}
      </div>
    </>

  );
}
