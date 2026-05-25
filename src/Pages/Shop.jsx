import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../features/productSlice';
import { fetchCategories } from '../features/categorySlice';
import ProductCard from '../Components/ProductCard';
import './Shop.css';
import '../styles/PageHero.css';

const Shop = () => {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch, status]);

  const activeCategory = categories.find((c) => c._id === categoryId);

  const displayProducts = products
    .filter((p) => p.main_image && p.main_image.startsWith('http'))
    .filter((p) => {
      if (!categoryId) return true;
      const catRef = p.category_id?._id || p.category_id;
      return catRef === categoryId;
    })
    .filter((p) => {
      if (!searchQuery) return true;
      return (
        p.name?.toLowerCase().includes(searchQuery) ||
        p.brand?.toLowerCase().includes(searchQuery)
      );
    });

  const setCategory = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('category', id);
    else params.delete('category');
    setSearchParams(params);
  };

  return (
    <div className="shop-page">
      <div className="page-hero">
        <h1>Shop</h1>
        <p>Discover premium skincare curated for every skin type</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          <ul className="shop-cat-list">
            <li>
              <button
                type="button"
                className={!categoryId ? 'active' : ''}
                onClick={() => setCategory(null)}
              >
                All Products
              </button>
            </li>
            {categories
              .filter((c) => c.isActive !== false)
              .map((cat) => (
                <li key={cat._id}>
                  <button
                    type="button"
                    className={categoryId === cat._id ? 'active' : ''}
                    onClick={() => setCategory(cat._id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
          </ul>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <p className="shop-count">
              {status === 'loading'
                ? 'Loading...'
                : `${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''}`}
              {activeCategory && ` in ${activeCategory.name}`}
            </p>
          </div>

          {status === 'loading' ? (
            <div className="loading-shimmer">Loading products...</div>
          ) : displayProducts.length === 0 ? (
            <div className="shop-empty">
              <p>No products found.</p>
              <Link to="/shop">View all products</Link>
            </div>
          ) : (
            <div className="shop-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
