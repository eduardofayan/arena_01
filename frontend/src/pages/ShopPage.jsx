import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { products } from '../data/sites';

export default function ShopPage() {
  const [cart, setCart] = useState({});

  const addProduct = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: { ...product, quantity: (prev[product.id]?.quantity || 0) + 1 },
    }));
  };

  const updateQty = (productId, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const item = next[productId];
      if (!item) return prev;
      item.quantity = Math.max(0, item.quantity + delta);
      if (item.quantity === 0) delete next[productId];
      return next;
    });
  };

  const subtotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeading
        eyebrow="Loja Arena01"
        title="Produtos premium para treinos e estilo"
        description="Escolha itens oficiais da marca para integrar o perfil premium da sua rotina esportiva."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.7fr]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <motion.article key={product.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1222]/80">
              <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">{product.category}</span>
                  <span className="text-sm text-slate-300">R$ {product.price.toFixed(2)}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{product.description}</p>
                <button onClick={() => addProduct(product)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
                  <ShoppingCart className="h-4 w-4" />
                  Adicionar
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <aside className="glass h-fit rounded-[28px] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Carrinho</h3>
            <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">{Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)} itens</span>
          </div>

          <div className="mt-6 space-y-4">
            {Object.values(cart).length === 0 ? (
              <p className="text-sm text-slate-400">Seu carrinho está vazio.</p>
            ) : (
              Object.values(cart).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">R$ {subtotal.toFixed(2)}</span>
            </div>
            <button className="mt-5 w-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
              Finalizar compra
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
