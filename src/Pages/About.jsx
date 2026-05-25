import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Heart, Award } from 'lucide-react';
import './About.css';
import '../styles/PageHero.css';

const values = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    text: 'We source authentic products from trusted brands so your skin gets only the best.',
  },
  {
    icon: Leaf,
    title: 'Clean & Safe',
    text: 'Every product is chosen with skin-friendly formulas and transparent ingredients.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    text: 'Your satisfaction drives us — from easy returns to fast nationwide delivery.',
  },
  {
    icon: Award,
    title: '100% Authentic',
    text: 'No counterfeits. All products are verified and sourced directly from brands.',
  },
];

const About = () => {
  return (
    <div className="about-page">
      <div className="page-hero">
        <h1>About GLOWFY</h1>
        <p>Your trusted destination for skincare in Pakistan</p>
      </div>

      <div className="about-content">
        <section className="about-intro">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              GLOWFY was built with a simple mission: make premium skincare accessible to
              everyone in Pakistan. From cleansers and serums to sunscreens and moisturizers,
              we bring international and local brands together in one place.
            </p>
            <p>
              Whether you are building a morning routine or targeting specific skin concerns,
              our curated collection helps you find products that truly work for your skin.
            </p>
            <Link to="/shop" className="about-cta-btn">
              Explore Our Shop
            </Link>
          </div>
          <div className="about-image-box">
            <div className="about-image-placeholder">
              <Sparkles size={48} color="#7b2cbf" />
              <span>GLOWFY Skincare</span>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Why Choose Us</h2>
          <div className="values-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="value-card">
                <div className="value-icon">
                  <Icon size={28} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-story">
          <h2>Our Story</h2>
          <p>
            Started in Karachi, GLOWFY began as a small passion project among skincare
            enthusiasts who were tired of unreliable products and long delivery times. Today
            we serve customers across Pakistan with fast shipping, genuine products, and a
            team that cares about your skin as much as you do.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
