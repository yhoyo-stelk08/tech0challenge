import Image from 'next/image';
import Link from 'next/link'; // Import Next.js Link component

// Define the type for products
interface Product {
 id: number;
 title: string;
 description: string;
 price: number;
 thumbnail: string;
}

const PRODUCTS_API = 'https://dummyjson.com/products';

// Server-side function to fetch products
async function fetchProducts(page: number, itemsPerPage: number) {
 const res = await fetch(
  `${PRODUCTS_API}?limit=${itemsPerPage}&skip=${(page - 1) * itemsPerPage}`,
  {
   cache: 'no-store', // Disable caching to fetch fresh data
  }
 );
 const data = await res.json();
 return data;
}

export default async function ProductsPage({ searchParams }: { searchParams: { page: string } }) {
 const page = searchParams.page ? Number(searchParams.page) : 1; // Get page from query, default to 1
 const itemsPerPage = 10;

 const data = await fetchProducts(page, itemsPerPage);
 const products: Product[] = data.products;
 const totalPages = Math.ceil(data.total / itemsPerPage);

 return (
  <div className='container mx-auto py-10'>
   <h1 className='text-2xl font-bold mb-4'>Product Page</h1>

   {/* Product List */}
   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
    {products.map((product) => (
     <div key={product.id} className='border p-4 rounded-md'>
      {/* Optimized Image with next/image */}
      <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
      <h2 className='text-xl font-bold'>{product.title}</h2>
      <p>{product.description}</p>
      <p className='text-lg font-semibold'>${product.price.toFixed(2)}</p>
     </div>
    ))}
   </div>

   {/* Pagination Controls */}
   <div className='mt-6 flex justify-center'>
    {/* Use Link without <a> tag */}
    {page > 1 && (
     <Link href={`?page=${page - 1}`} className='mr-4 bg-blue-500 text-white px-4 py-2 rounded'>
      Previous
     </Link>
    )}

    <span className='px-4 py-2'>
     {page} of {totalPages}
    </span>

    {page < totalPages && (
     <Link href={`?page=${page + 1}`} className='ml-4 bg-blue-500 text-white px-4 py-2 rounded'>
      Next
     </Link>
    )}
   </div>
  </div>
 );
}
