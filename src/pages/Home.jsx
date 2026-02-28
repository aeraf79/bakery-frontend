import API_BASE_URL from "../config";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, MapPin, Clock, Phone,
  Instagram, Facebook, Star, ShoppingCart, ArrowRight,
  Wheat, Flame, Leaf, Award, Heart, Package, X
} from 'lucide-react';
import './home.css';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

const CATEGORIES = ['All', 'Breads', 'Pastries', 'Cakes', 'Cookies', 'Muffins'];

const TESTIMONIALS = [
  { name: 'Aarav Shah', loc: 'Mumbai', text: "The sourdough is unlike anything I've had outside Paris. Every loaf arrives perfectly crusty and deeply flavored.", stars: 5, initials: 'AS' },
  { name: 'Priya Nair', loc: 'Bengaluru', text: "Same-day delivery and still warm! The almond croissants shatter perfectly and taste incredibly buttery.", stars: 5, initials: 'PN' },
  { name: 'Rohan Mehta', loc: 'Delhi', text: "We ordered a custom birthday cake — the decoration was stunning and it tasted even better than it looked.", stars: 5, initials: 'RM' },
  { name: 'Sneha Iyer', loc: 'Pune', text: "I've been ordering every Sunday for six months. The quality is absolutely consistent — it's become our family ritual.", stars: 5, initials: 'SI' },
];

const STATS = [
  { value: '38+', label: 'Years of Heritage' },
  { value: '50+', label: 'Daily Varieties' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '5K+', label: 'Happy Customers' },
];

/* ─── Carousel Images ─────────────────────────────────────────────────────── */
const CAROUSEL_IMAGES = [
  { src: 'https://i.ibb.co/wrLpH7s1/b1.jpg', alt: 'Slide 1' },
  { src: 'https://i.ibb.co/qM4s0B9m/b3.jpg', alt: 'Slide 2' },
  { src: 'https://i.ibb.co/211sVSQq/b2.jpg', alt: 'Slide 3' },
  { src: 'https://i.ibb.co/TDPq5zt9/b4.jpg', alt: 'Slide 4' },
];

/* ─── Product Card ────────────────────────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
  const [imgErr, setImgErr] = useState(false);
  const fallback = `https://placehold.co/600x400/c8845a/fff?text=${encodeURIComponent(product.name || 'Item')}`;
  return (
    <div className="hm-pcard" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="hm-pcard__img">
        <img
          src={imgErr || !product.imageUrl ? fallback : product.imageUrl}
          alt={product.name}
          onError={() => setImgErr(true)}
          loading="lazy"
        />
        <div className="hm-pcard__cat">{product.category}</div>
      </div>
      <div className="hm-pcard__body">
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
        <div className="hm-pcard__foot">
          <span className="hm-pcard__price">{formatPrice(product.price)}</span>
          {product.unit && <span className="hm-pcard__unit">/{product.unit}</span>}
        </div>
      </div>
    </div>
  );
};

/* ─── Testimonial Slider ──────────────────────────────────────────────────── */
const TestimonialSlider = () => {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hm-tslider">
      <div className="hm-tslider__card" key={idx}>
        <div className="hm-tslider__stars">{'★'.repeat(t.stars)}</div>
        <p className="hm-tslider__text">"{t.text}"</p>
        <div className="hm-tslider__author">
          <div className="hm-tslider__avatar">{t.initials}</div>
          <div>
            <strong>{t.name}</strong>
            <span>{t.loc}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="hm-tslider__btn" onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>
          <ChevronLeft size={20} />
        </button>
        <div className="hm-tslider__dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`hm-tslider__dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
        <button className="hm-tslider__btn" onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

/* ─── Countdown ───────────────────────────────────────────────────────────── */
const useCountdown = () => {
  const [t, setT] = useState({ h: '08', m: '45', s: '30' });
  useEffect(() => {
    const end = new Date(); end.setHours(23, 59, 59, 0);
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setT({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
};

/* ─── Offer Carousel ──────────────────────────────────────────────────────── */
const OfferCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const currentRef = useRef(0);   // always holds the latest index without stale closure

  // keep ref in sync
  useEffect(() => { currentRef.current = current; }, [current]);

  const startAutoPlay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % CAROUSEL_IMAGES.length;
      currentRef.current = next;
      setCurrent(next);
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(timerRef.current);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (index) => {
    // Wrap correctly for any number of slides
    const next = ((index % CAROUSEL_IMAGES.length) + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    currentRef.current = next;
    setCurrent(next);
    startAutoPlay();   // reset timer on manual navigation
  };

  return (
    <div className="hm-offer__carousel">

      {/* Slides */}
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`hm-offer__carousel-slide${i === current ? ' active' : ''}`}
        >
          <img src={img.src} alt={img.alt} />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="hm-offer__carousel-overlay" />

      {/* Prev arrow */}
      <button
        className="hm-offer__carousel-ctrl hm-offer__carousel-ctrl--prev"
        onClick={() => goTo(current - 1)}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next arrow */}
      <button
        className="hm-offer__carousel-ctrl hm-offer__carousel-ctrl--next"
        onClick={() => goTo(current + 1)}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="hm-offer__carousel-dots">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`hm-offer__carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const productsRef = useRef(null);
  const countdown   = useCountdown();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res  = await fetch('https://bakery-backend-production-2dfd.up.railway.app/api/products/available');
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="hm-root">

      {/* ─── NAV ──────────────────────────────────────────────────────────── */}
      <nav className={`hm-nav${scrolled ? ' hm-nav--scrolled' : ''}`}>
        <div className="hm-nav__inner">
          <div className="hm-nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Maison Dorée
          </div>
          <div className={`hm-nav__links${menuOpen ? ' open' : ''}`}>
            <a href="#home"     onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>Menu</a>
            <a href="#about"    onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact"  onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <div className="hm-nav__ctas">
            <button className="hm-nav__login"    onClick={() => navigate('/login')}>Sign In</button>
            <button className="hm-nav__register" onClick={() => navigate('/register')}>Order Now</button>
          </div>
          <button className="hm-nav__burger" onClick={() => setMenuOpen(p => !p)}>
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="hm-nav__mobile-menu">
            <a href="#home"     onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>Menu</a>
            <a href="#about"    onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact"  onClick={() => setMenuOpen(false)}>Contact</a>
            <button onClick={() => { navigate('/login');    setMenuOpen(false); }}>Sign In</button>
            <button onClick={() => { navigate('/register'); setMenuOpen(false); }}>Order Now</button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hm-hero" id="home">
        <div className="hm-hero__grain" />
        <div className="hm-hero__content">
          <div className="hm-hero__pill"><Flame size={14} /> Artisan Bakery Since 1985</div>
          <h1 className="hm-hero__title">Every Loaf<br />Tells a <em>Story</em></h1>
          <p className="hm-hero__sub">Handcrafted with love each morning, baked in the old-world tradition — delivered fresh to your door.</p>
          <div className="hm-hero__actions">
            <button className="hm-btn hm-btn--primary" onClick={scrollToProducts}>Explore Menu <ArrowRight size={18} /></button>
            <button className="hm-btn hm-btn--outline" onClick={() => navigate('/register')}>Start Ordering</button>
          </div>
          <div className="hm-hero__trust">
            <span><Award size={15} /> Award Winning</span>
            <span><Leaf size={15} /> 100% Natural</span>
            <span><ShoppingCart size={15} /> Same-Day Delivery</span>
          </div>
        </div>
        <div className="hm-hero__visual">
          <div className="hm-hero__imgstack">
            <div className="hm-hero__img hm-hero__img--1">
              <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop" alt="Artisan bread" />
            </div>
            <div className="hm-hero__img hm-hero__img--2">
              <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop" alt="Croissant" />
            </div>
            <div className="hm-hero__img hm-hero__img--3">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop" alt="Cake" />
            </div>
            <div className="hm-hero__badge">
              <span className="hm-hero__badge-num">35+</span>
              <span className="hm-hero__badge-txt">Years of<br />Tradition</span>
            </div>
          </div>
        </div>
        <div className="hm-hero__scroll" onClick={scrollToProducts}>↓</div>
      </section>

      {/* ─── TRUST BAR ────────────────────────────────────────────────────── */}
      <div className="hm-trust">
        <div className="hm-trust__item"><Wheat size={20} /><div><strong>Heritage Recipes</strong><span>3 generations of bakers</span></div></div>
        <div className="hm-trust__div" />
        <div className="hm-trust__item"><Flame size={20} /><div><strong>Baked Daily</strong><span>Fresh every morning at 4 AM</span></div></div>
        <div className="hm-trust__div" />
        <div className="hm-trust__item"><Leaf size={20} /><div><strong>100% Natural</strong><span>No preservatives ever</span></div></div>
        <div className="hm-trust__div" />
        <div className="hm-trust__item"><Package size={20} /><div><strong>Free Delivery</strong><span>Orders above ₹500</span></div></div>
        <div className="hm-trust__div" />
        <div className="hm-trust__item"><Award size={20} /><div><strong>Award Winning</strong><span>Best Bakery 2023</span></div></div>
      </div>

      {/* ─── OFFER BANNER ─────────────────────────────────────────────────── */}
      <section className="hm-offer">
        <div className="hm-offer__inner">
          <div className="hm-offer__content">
            <div className="hm-offer__tag">🔥 Today Only</div>
            <h2 className="hm-offer__title">Morning Rush <em>Special</em></h2>
            <p className="hm-offer__desc">Get <strong>20% off</strong> all pastries when you order before 10 AM. The freshest start to your day.</p>
            <div className="hm-offer__countdown">
              <div className="hm-cd"><span className="hm-cd__val">{countdown.h}</span><span className="hm-cd__lbl">hrs</span></div>
              <span className="hm-cd__sep">:</span>
              <div className="hm-cd"><span className="hm-cd__val">{countdown.m}</span><span className="hm-cd__lbl">min</span></div>
              <span className="hm-cd__sep">:</span>
              <div className="hm-cd"><span className="hm-cd__val">{countdown.s}</span><span className="hm-cd__lbl">sec</span></div>
            </div>
            <button className="hm-btn hm-btn--gold" onClick={() => navigate('/register')}>
              Claim Offer <ArrowRight size={18} />
            </button>
          </div>
          <OfferCarousel />
        </div>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────────────────────────────── */}
      <section className="hm-products" id="products" ref={productsRef}>
        <div className="hm-section-head">
          <div className="hm-section-label">Our Specialties</div>
          <h2>Daily Fresh Delights</h2>
          <p>Every item baked from scratch each morning. Tap to order — sign up for full menu access.</p>
        </div>
        <div className="hm-catpills">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`hm-catpill${activeCategory === cat ? ' active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
              {products.length > 0 && (
                <span>{cat === 'All' ? products.length : products.filter(p => p.category === cat).length}</span>
              )}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="hm-state"><div className="hm-spinner" /><p>Loading fresh products…</p></div>
        ) : error ? (
          <div className="hm-state">
            <X size={40} />
            <h3>Couldn't load products</h3>
            <p>Make sure the backend is running at <code>localhost:8080</code></p>
            <p className="hm-state__err">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hm-state">
            <Package size={48} />
            <h3>Nothing in this category yet</h3>
            <button className="hm-btn hm-btn--outline" onClick={() => setActiveCategory('All')}>Show All</button>
          </div>
        ) : (
          <div className="hm-pgrid">
            {filtered.slice(0, 8).map((p, i) => (
              <ProductCard key={p.productId || i} product={p} index={i} />
            ))}
          </div>
        )}
        {!loading && !error && filtered.length > 8 && (
          <div className="hm-products__more">
            <p>Showing 8 of {filtered.length} items</p>
            <button className="hm-btn hm-btn--outline" onClick={() => navigate('/register')}>View Full Menu <ArrowRight size={18} /></button>
          </div>
        )}
        {!loading && !error && (
          <div className="hm-products__cta">
            <div className="hm-products__cta-inner">
              <span>🔐</span>
              <div>
                <strong>Want to order?</strong>
                <p>Create a free account to access our full menu, place orders, and track delivery.</p>
              </div>
              <button className="hm-btn hm-btn--primary" onClick={() => navigate('/register')}>Create Account <ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </section>

      {/* ─── ABOUT ────────────────────────────────────────────────────────── */}
      <section className="hm-about" id="about">
        <div className="hm-about__img">
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop" alt="Baker at work" />
          <div className="hm-about__img-badge">Master Bakers</div>
        </div>
        <div className="hm-about__content">
          <div className="hm-section-label">Our Story</div>
          <h2>The Art of Traditional Baking</h2>
          <p>Every morning before sunrise, our master bakers begin their craft. Using techniques passed down through three generations and only the finest organic ingredients, we create breads and pastries that honor the timeless tradition of artisan baking.</p>
          <p>From our signature sourdough starter — cultivated for over 30 years — to our hand-laminated croissants, each product is a labor of love and dedication.</p>
          <div className="hm-about__feats">
            <div className="hm-about__feat"><Award size={22} /><div><strong>Award Winning</strong><p>Multiple national baking awards since 1995.</p></div></div>
            <div className="hm-about__feat"><Heart size={22} /><div><strong>Made Fresh Daily</strong><p>Nothing sits on the shelf overnight.</p></div></div>
            <div className="hm-about__feat"><Leaf size={22} /><div><strong>100% Natural</strong><p>No preservatives, additives, or shortcuts.</p></div></div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <div className="hm-stats">
        {STATS.map((s, i) => (
          <div key={i} className="hm-stats__item">
            <span className="hm-stats__val">{s.value}</span>
            <span className="hm-stats__lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ─── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="hm-gallery">
        <div className="hm-section-head hm-section-head--light">
          <div className="hm-section-label hm-section-label--gold">Instagram Gallery</div>
          <h2>Behind the Scenes</h2>
        </div>
        <div className="hm-gallery__grid">
          {[
            { src: 'https://i.ibb.co/wFKMVqW1/tabitha-turner-Ns2a-J5-OXKds-unsplash.jpg', title: 'Morning Batch' },
            { src: 'https://i.ibb.co/5xskVtNn/nathan-dumlao-z3em1-GBRhv-Y-unsplash.jpg', title: 'Perfect Layers' },
            { src: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop', title: 'Artisan Baguettes' },
            { src: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&auto=format&fit=crop', title: 'Sweet Creations' },
            { src: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&auto=format&fit=crop', title: 'Cinnamon Heaven' },
            { src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop', title: 'Master at Work' },
          ].map((g, i) => (
            <div key={i} className="hm-gallery__item">
              <img src={g.src} alt={g.title} loading="lazy" />
              <div className="hm-gallery__overlay">{g.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="hm-testimonials">
        <div className="hm-section-head">
          <div className="hm-section-label">Customer Love</div>
          <h2>What Our Community Says</h2>
        </div>
        <TestimonialSlider />
      </section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────── */}
      <section className="hm-contact" id="contact">
        <div className="hm-section-head">
          <div className="hm-section-label">Find Us</div>
          <h2>Visit the Bakery</h2>
        </div>
        <div className="hm-contact__grid">
          <div className="hm-contact__item">
            <div className="hm-contact__icon"><MapPin size={26} /></div>
            <h4>Location</h4>
            <p>123 Artisan Street<br />Mumbai, Maharashtra</p>
          </div>
          <div className="hm-contact__item">
            <div className="hm-contact__icon"><Clock size={26} /></div>
            <h4>Hours</h4>
            <p>Mon–Sat: 6 AM – 8 PM<br />Sunday: 7 AM – 6 PM</p>
          </div>
          <div className="hm-contact__item">
            <div className="hm-contact__icon"><Phone size={26} /></div>
            <h4>Phone</h4>
            <p>+91 98765 43210</p>
          </div>
        </div>
        <div className="hm-contact__socials">
          <a href="#" className="hm-contact__soc"><Instagram size={22} /></a>
          <a href="#" className="hm-contact__soc"><Facebook size={22} /></a>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────────────────── */}
      <div className="hm-nl">
        <div className="hm-nl__inner">
          <div className="hm-nl__left">
            <span>📬</span>
            <div>
              <h3>Get Fresh Offers in Your Inbox</h3>
              <p>Weekly deals, new arrivals, and baking secrets from our chefs.</p>
            </div>
          </div>
          <div className="hm-nl__right">
            <div className="hm-nl__form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
            <p>No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="hm-footer">
        <div className="hm-footer__inner">
          <div className="hm-footer__brand">
            <div className="hm-footer__logo">Maison Dorée</div>
            <p>Artisan baking with love since 1985. Every bite tells a story of heritage and passion.</p>
            <div className="hm-footer__socials">
              <a href="#"><Instagram size={18} /></a>
              <a href="#"><Facebook size={18} /></a>
            </div>
          </div>
          <div className="hm-footer__col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#products">Menu</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="hm-footer__col">
            <h4>Account</h4>
            <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Sign In</span>
            <span onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>Register</span>
          </div>
          <div className="hm-footer__col">
            <h4>Contact</h4>
            <span>123 Artisan Street, Mumbai</span>
            <span>+91 98765 43210</span>
            <span>hello@maisondoree.in</span>
          </div>
        </div>
        <div className="hm-footer__bottom">
          <p>© 2025 Maison Dorée Artisan Bakery. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;