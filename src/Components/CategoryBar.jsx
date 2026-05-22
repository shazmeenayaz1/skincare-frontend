import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import './CategoryBar.css';

const CategoryBar = () => {
  const { items: allCategories } = useSelector((state) => state.categories);
  
  // Use first 10 categories for the bar
  const categories = allCategories.slice(0, 10);

  return (
    <div className="category-bar">
      <div className="category-container">
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li key={index} className="category-item">
              <a href="#" className={`category-link ${cat.name === 'Skincare' ? 'active' : ''}`}>
                {cat.name}
                {cat.hasDropdown && <ChevronDown size={14} className="dropdown-icon" />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryBar;
