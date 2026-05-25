import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';
import '../styles/PageHero.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-page">
      <div className="page-hero">
        <h1>Contact Us</h1>
        <p>We would love to hear from you — reach out anytime</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-cards">
          <div className="info-card">
            <Phone size={24} />
            <h3>Phone</h3>
            <p>+92 328 4418502</p>
            <p>(021) 111 444 439</p>
          </div>
          <div className="info-card">
            <Mail size={24} />
            <h3>Email</h3>
            <p>support@glowfy.pk</p>
          </div>
          <div className="info-card">
            <MapPin size={24} />
            <h3>Address</h3>
            <p>
              Khaliq-uz-Zaman Rd, Block 8 Clifton, Karachi, Sindh 75600
            </p>
          </div>
          <div className="info-card">
            <Clock size={24} />
            <h3>Hours</h3>
            <p>Mon – Sat: 10am – 8pm</p>
            <p>Sunday: 12pm – 6pm</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="contact-success">
              Thank you! Your message has been sent. We will get back to you soon.
            </div>
          )}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
              />
            </div>
            <button type="submit" className="contact-submit-btn">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
