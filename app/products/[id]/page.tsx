import { Carousel } from 'flowbite-react'; // Flowbite Carousel component
import Image from 'next/image';
import Link from 'next/link';

// Function to fetch individual product details
async function fetchProduct(id: string) {
 const res = await fetch(`https://dummyjson.com/products/${id}`);
 if (!res.ok) {
  throw new Error('Failed to fetch product details');
 }
 const product = await res.json();
 return product;
}

// Dynamic product page
export default async function ProductPage({ params }: { params: { id: string } }) {
 const product = await fetchProduct(params.id);

 return (
  <div className='container mx-auto py-10 px-8'>
   <Link href='/products' className='hover:text-blue-600 bg-clip-text'>
    Back to Products
   </Link>
   {/* Product Carousel */}
   <div className='w-full h-96'>
    <Carousel>
     {product.images.map((image: string, index: number) => (
      <div key={index} className='relative h-svh'>
       <Image
        src={image}
        alt={`${product.title} Image ${index + 1}`}
        fill
        // style={{ objectFit: 'cover' }}
        className='rounded-md object-contain'
       />
      </div>
     ))}
    </Carousel>
   </div>
   <div className='flex flex-col justify-center items-center'>
    <h1 className='text-3xl font-bold mb-6'>{product.title}</h1>

    {/* Product Description */}
    <p className='text-lg mb-4'>{product.description}</p>
    <p className='text-xl font-semibold mb-6'>${product.price.toFixed(2)}</p>
   </div>
  </div>
 );
}
