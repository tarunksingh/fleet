import { useEffect, useState } from 'react';
import { api } from '../api';
import { Product } from '../types';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBanner from '../components/ErrorBanner';
import Toast from '../components/Toast';

export default function AdminProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setProducts(await api.getProducts());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    try {
      setError('');
      const product = await api.createProduct({ name });
      setProducts((prev) => [...prev, product]);
      setName('');
      showToast('Product created.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <LoadingIndicator />;

  return (
    <div className="admin-dashboard-main">
      {error && <ErrorBanner message={error} />}
      {toast && <Toast message={toast} type="success" />}

      <div className="card-grid">
        <div className="card">
          <h2>Create Product</h2>
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <button onClick={handleCreate}>Create Product</button>
        </div>

        <div className="card">
          <h2>Product Catalog</h2>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}><td>{product.id}</td><td>{product.name}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
