import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Flame, Award, Calendar } from 'lucide-react';
import ProductCard from './ProductCard';
import './BestSellers.css';

const ProductSection = ({ title, description, products, icon }) => {
  if (products.length === 0) return null;
  return (
    <div className="homepage-section animate-fade-in">
      <div className="section-header-centered" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-pink)' }}>
          {icon}
          <h2 className="section-title section-title-center" style={{ fontSize: '2.2rem', margin: 0, display: 'inline-flex', alignItems: 'center' }}>
            {title}
          </h2>
        </div>
        {description && <p className="text-secondary" style={{ fontSize: '0.95rem', marginTop: '6px' }}>{description}</p>}
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const { items, status } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const activeCategory = categories.find((c) => c._id === categoryId);

  // General filter: must have an image and match category if active
  const filteredProducts = items
    .filter((p) => p.main_image && (p.main_image.startsWith('http') || p.main_image.startsWith('/uploads')))
    .filter((p) => {
      if (!categoryId) return true;
      const catRef = p.category_id?._id || p.category_id;
      return catRef === categoryId;
    });

  // 1. Best Selling Products (Original catalog view, up to 8 items)
  const bestSellingProducts = filteredProducts.slice(0, 8);

  // 2. Curated Featured Products (is_featured, up to 8 items)
  const featuredProducts = filteredProducts.filter((p) => p.is_featured).slice(0, 8);

  // 3. Most Popular Products (price >= 2500 and has a discount, up to 8 items)
  const mostPopularProducts = filteredProducts.filter((p) => p.price >= 2500 && p.discount_price).slice(0, 8);

  // 4. New Arrivals (Newly added Korean products starting with KR-GLOW SKU, up to 8 items)
  const newArrivalsProducts = filteredProducts.filter((p) => p.sku && p.sku.startsWith('KR-GLOW')).reverse().slice(0, 8);

  if (status === 'loading') {
    return (
      <section id="products" className="best-sellers featured-products">
        <div className="section-container">
          <div className="section-header-centered">
            <h2 className="section-title section-title-center">Our Collection</h2>
          </div>
          <div className="loading-shimmer loading-centered">Loading products...</div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section id="products" className="best-sellers featured-products">
        <div className="section-container">
          <div className="section-header-centered">
            <h2 className="section-title section-title-center">Our Collection</h2>
          </div>
          <p className="no-products-msg" style={{ textAlign: 'center' }}>
            No products found in this category.{' '}
            <Link to="/" className="clear-filter-link">View all products</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="best-sellers featured-products">
      <div className="section-container">
        
        {/* Category Header Helper (if filtering by category) */}
        {categoryId && activeCategory && (
          <div className="section-header-centered" style={{ marginBottom: '3.5rem' }}>
            <p className="section-filter-note">
              Showing Results for: <strong>{activeCategory.name}</strong>
              {' · '}
              <Link to="/" className="clear-filter-link" style={{ marginLeft: '8px' }}>
                Clear filter
              </Link>
            </p>
          </div>
        )}

        {/* Section 1: Best Selling Products (Original) */}
        <ProductSection 
          title="Best Selling Products" 
          description="Dermatologist recommended bestselling formulas for healthy, glowing skin."
          products={bestSellingProducts}
          icon={<Flame size={28} />}
        />

        {/* Section 2: Curated Featured Products */}
        <ProductSection 
          title="Curated Featured Products" 
          description="Handpicked luxury skincare essentials selected by our top beauty experts."
          products={featuredProducts}
          icon={<Sparkles size={28} />}
        />

        {/* Section 3: Most Popular Products */}
        <ProductSection 
          title="Most Popular Products" 
          description="Customer favorites and top rated deals with exciting discount offers."
          products={mostPopularProducts}
          icon={<Award size={28} />}
        />

        {/* Section 4: New Arrivals */}
        <ProductSection 
          title="New Arrivals" 
          description="Freshly imported authentic Korean skincare products straight from Seoul."
          products={newArrivalsProducts}
          icon={<Calendar size={28} />}
        />

      </div>

      <style>{`
        .homepage-section {
          margin-bottom: 5.5rem;
          padding-bottom: 2rem;
        }

        .homepage-section:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .section-title-center {
          display: inline-flex !important;
          align-items: center;
          background: linear-gradient(135deg, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        body.light .section-title-center {
          background: linear-gradient(135deg, #18181b, #52525b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .homepage-section {
            margin-bottom: 3.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;


