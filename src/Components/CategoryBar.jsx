import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CategoryBar.css';

const CategoryBar = () => {
  const scrollRef = useRef(null);
  const { items: allCategories, status } = useSelector((state) => state.categories);
  const [searchParams] = useSearchParams();
  const activeCategoryId = searchParams.get('category');

  const categories = allCategories.filter((cat) => cat.isActive !== false);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (status === 'loading') {
    return (
      <div className="category-bar">
        <div className="category-container">
          <div className="category-skeleton">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="category-bar">
      <button
        type="button"
        className="category-scroll-btn category-scroll-left"
        onClick={() => scroll('left')}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="category-container" ref={scrollRef}>
        <ul className="category-list">
          <li className="category-item">
            <Link
              to="/"
              className={`category-link ${!activeCategoryId ? 'active' : ''}`}
            >
              All
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat._id} className="category-item">
              <Link
                to={`/?category=${cat._id}#products`}
                className={`category-link ${activeCategoryId === cat._id ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="category-scroll-btn category-scroll-right"
        onClick={() => scroll('right')}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CategoryBar;
