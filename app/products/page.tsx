'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define the type for products
interface Product {
 id: number;
 title: string;
 description: string;
 price: number;
 thumbnail: string;
 category: string;
}

const PRODUCTS_API = 'https://dummyjson.com/products';

// Client-side function to fetch products
async function fetchProducts(page: number, itemsPerPage: number) {
 try {
  const res = await fetch(
   `${PRODUCTS_API}?limit=${itemsPerPage}&skip=${(page - 1) * itemsPerPage}`,
   {
    cache: 'no-store', // Disable caching to fetch fresh data
   }
  );

  if (!res.ok) {
   throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  return data;
 } catch (error) {
  console.error(error);
  return { products: [], total: 0 };
 }
}

export default function ProductsPage({ searchParams }: { searchParams: { page: string } }) {
 const [products, setProducts] = useState<Product[]>([]);
 const [totalPages, setTotalPages] = useState(1);
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
 const [categoryFilter, setCategoryFilter] = useState<string>('');
 const [categories, setCategories] = useState<string[]>([]); // Store the categories

 const page =
  searchParams.page && !isNaN(Number(searchParams.page)) ? Number(searchParams.page) : 1;
 const itemsPerPage = 10;

 useEffect(() => {
  // Fetch products on mount or page change
  async function loadProducts() {
   const data = await fetchProducts(page, itemsPerPage);
   setProducts(data.products);
   setTotalPages(Math.ceil(data.total / itemsPerPage));

   // Extract unique categories from the products
   const uniqueCategories = Array.from(
    new Set(data.products.map((product: Product) => product.category))
   );
   setCategories(uniqueCategories as string[]);
  }
  loadProducts();
 }, [page]);

 // Reset Filters
 const resetFilters = () => {
  setCategoryFilter('');
  setSortOrder(null);
 };

 // Filter products by category
 const filteredProducts = products.filter((product) =>
  categoryFilter ? product.category === categoryFilter : true
 );

 // Sort products by price
 const sortedProducts = filteredProducts.sort((a, b) => {
  if (sortOrder === 'asc') return a.price - b.price;
  if (sortOrder === 'desc') return b.price - a.price;
  return 0;
 });

 return (
  <div className='container mx-auto p-10'>
   <h1 className='text-3xl font-bold mb-4 text-center py-8 text-white'>Our Products</h1>

   {/* Filters and Sorting */}
   <div className='flex justify-between items-center mb-4'>
    {/* Category Filter */}
    <div>
     <label htmlFor='category' className='mr-2 text-white'>
      Filter by Category:
     </label>
     <select
      id='category'
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className='border px-4 py-2 rounded-md'
     >
      <option value=''>All</option>
      {categories.map((category) => (
       <option key={category} value={category}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
       </option>
      ))}
     </select>
    </div>

    {/* Sorting */}
    <div>
     <button
      onClick={() => setSortOrder('asc')}
      className={`mr-2 px-4 py-2 rounded-md ${
       sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
     >
      Sort by Price (Low to High)
     </button>
     <button
      onClick={() => setSortOrder('desc')}
      className={`px-4 py-2 rounded-md ${
       sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
     >
      Sort by Price (High to Low)
     </button>
    </div>

    {/* Reset Filters */}
    <button onClick={resetFilters} className='bg-red-500 text-white px-4 py-2 rounded-md'>
     Reset Filters
    </button>
   </div>

   {/* Product List */}
   <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
    {sortedProducts.map((product) => (
     <div
      key={product.id}
      className='border bg-gradient-to-br from-green-400 to-blue-500 p-4 text-slate-700 rounded-md'
     >
      {/* Optimized Image with next/image */}
      <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
      <h2 className='text-xl font-bold py-4'>{product.title}</h2>
      <p className='font-light'>{product.description}</p>
      <p className='text-rose-950 font-semibold py-6 text-4xl'>${product.price.toFixed(2)}</p>
      {/* View Details Link */}
      <Link href={`/products/${product.id}`} className='text-white hover:underline mt-2 block'>
       View Details
      </Link>
     </div>
    ))}
   </div>

   {/* Pagination Controls */}
   <div className='mt-6 flex justify-center'>
    {page > 1 && (
     <Link href={`?page=${page - 1}`} className='mr-4 bg-blue-500 text-white px-4 py-2 rounded'>
      Previous
     </Link>
    )}

    <span className='px-4 py-2 text-white'>
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
