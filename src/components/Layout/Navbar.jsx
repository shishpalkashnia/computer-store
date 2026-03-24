import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaLaptop } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { to: '/', label: 'Home', isHash: false },
    { to: '/#products', label: 'Products', isHash: true },
    { to: '/#location', label: 'Contact', isHash: true },
    { to: '/admin', label: 'Admin', isHash: false },
  ];

  if (isAdmin) {
    return null; // Admin has its own sidebar now
  }

  const handleNavClick = (e, link) => {
    if (link.isHash && location.pathname === '/') {
      e.preventDefault();
      const id = link.to.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', link.to);
      }
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-text">
            <span className="navbar-title" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>ONLINE COMPUTERS</span>
            <span className="navbar-subtitle" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', marginTop: '2px', color: 'var(--text-secondary)' }}>SIRSA</span>
          </div>
        </Link>

        <>
          <div className="navbar-links">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="navbar-link"
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar-link ${location.pathname === link.to && !location.hash ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <button
            className="navbar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="navbar-mobile"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {navLinks.map((link) => (
                  link.isHash ? (
                    <a
                      key={link.to}
                      href={link.to}
                      className="navbar-mobile-link"
                      onClick={(e) => handleNavClick(e, link)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="navbar-mobile-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      </div>
    </motion.nav>
  );
}
