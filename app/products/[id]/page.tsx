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

 // Determine badge style based on availability
 const getAvailabilityBadge = (availability: string) => {
  switch (availability.toLowerCase()) {
   case 'in stock':
    return 'bg-green-500 text-white';
   case 'low stock':
    return 'bg-yellow-500 text-white';
   case 'out of stock':
    return 'bg-red-500 text-white';
   default:
    return 'bg-gray-500 text-white';
  }
 };

 return (
  <div className='container mx-auto py-10 px-8'>
   <Link href='/products' className='hover:text-green-500 bg-clip-text text-orange-100'>
    Back to Products
   </Link>

   {/* Product Carousel */}
   <div className='w-full h-96 mb-6'>
    <Carousel>
     {product.images.map((image: string, index: number) => (
      <div key={index} className='relative h-full'>
       <Image
        src={image}
        alt={`${product.title} Image ${index + 1}`}
        fill
        className='rounded-md object-contain'
       />
      </div>
     ))}
    </Carousel>
   </div>

   <div className='flex flex-col justify-center items-center text-white'>
    <h1 className='text-3xl font-bold mb-6'>{product.title}</h1>

    {/* Availability Badge */}
    <span
     className={`px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getAvailabilityBadge(
      product.availabilityStatus
     )}`}
    >
     {product.availabilityStatus}
    </span>

    {/* Product Description */}
    <p className='text-lg mb-4'>{product.description}</p>

    {/* Product Price */}
    <p className='text-xl font-semibold mb-6'>${product.price.toFixed(2)}</p>
   </div>
  </div>
 );
}
