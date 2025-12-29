// src/services/api.ts
export async function fetchProducts(page: number) {
  await new Promise(r => setTimeout(r, 800)); // simulate latency

  return Array.from({ length: 10 }).map((_, i) => ({
    id: `p-${page}-${i}`,
    name: `Product ${page}-${i}`,
    price: 'Rp 199.000',
    image: `https://picsum.photos/40${i}`,
  }));
}
