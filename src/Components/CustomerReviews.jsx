import React from 'react';
import { Star, Quote } from 'lucide-react';
import './CustomerReviews.css';

const reviews = [
  {
    id: 1,
    name: 'Ayesha K.',
    product: 'Vitamin C Serum',
    rating: 5,
    text: 'My skin looks brighter within two weeks. Genuine product and fast delivery to Lahore!',
  },
  {
    id: 2,
    name: 'Sara M.',
    product: 'Hydrating Moisturizer',
    rating: 5,
    text: 'Perfect for dry skin in winter. Lightweight, no sticky feeling. Will order again.',
  },
  {
    id: 3,
    name: 'Fatima R.',
    product: 'Sunscreen SPF 50',
    rating: 4,
    text: 'No white cast and works well under makeup. Great value compared to other stores.',
  },
  {
    id: 4,
    name: 'Zainab H.',
    product: 'Face Cleanser',
    rating: 5,
    text: 'Gentle on sensitive skin. Packaging was secure and customer support replied quickly.',
  },
];

const CustomerReviews = () => {
  return (
    <section id="reviews" className="customer-reviews">
      <div className="reviews-container">
        <h2 className="reviews-section-title">Customer Reviews</h2>
        <p className="reviews-section-subtitle">
          Real feedback from shoppers who love GLOWFY
        </p>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <Quote size={28} className="review-quote-icon" aria-hidden />
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? '#ffb703' : 'none'}
                    color={i < review.rating ? '#ffb703' : '#ddd'}
                  />
                ))}
              </div>
              <p className="review-text">&ldquo;{review.text}&rdquo;</p>
              <div className="review-author">
                <span className="review-name">{review.name}</span>
                <span className="review-product">— {review.product}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
