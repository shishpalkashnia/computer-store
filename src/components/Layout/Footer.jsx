import { FaLaptop, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="navbar-logo-icon">
                <FaLaptop />
              </div>
              <div>
                <h3>Online Computers</h3>
                <span className="footer-tagline">Sirsa</span>
              </div>
            </div>
            <p className="footer-desc">
              Your trusted destination for quality used laptops in Sirsa.
              Best prices, genuine products, and reliable after-sales support.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/#products">Products</Link>
            <Link to="/#location">Visit Us</Link>
            <Link to="/admin">Admin</Link>
          </div>

          <div className="footer-links-col">
            <h4>Contact Us</h4>
            <a href="tel:+917082604232" className="footer-contact-item">
              <FaPhone /> +91 98765 43210
            </a>
            <a href="mailto:onlinecomputerssirsa@gmail.com" className="footer-contact-item">
              <FaEnvelope /> onlinecomputerssirsa@gmail.com
            </a>
            <a
              href="https://wa.me/917082604232"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item whatsapp"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <div className="footer-contact-item">
              <FaMapMarkerAlt /> Sirsa, Haryana, India
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Online Computers Sirsa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
