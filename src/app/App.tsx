import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Search, X, Plus, Minus, ArrowRight, Star,
  Edit2, Trash2, Package, Users, Settings, LogOut,
  ChevronDown, TrendingUp, Eye, BarChart3, Check,
  ChevronLeft, ChevronRight, SlidersHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "catalog" | "product" | "cart" | "login" | "register" | "admin";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  description: string;
  image: string;
  tag?: string;
  rating: number;
  reviews: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1, name: "Minimal White Tee", price: 45, category: "tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A clean-cut heavyweight tee crafted from 100% GOTS-certified organic cotton. Relaxed fit with dropped shoulders and a subtle garment wash for lived-in texture. Triple-stitched seams ensure long-lasting durability.",
    image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=750&fit=crop&auto=format",
    tag: "New", rating: 4.8, reviews: 142, stock: 84,
  },
  {
    id: 2, name: "Charcoal Cargo Pants", price: 120, category: "bottoms",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Technical cargo pants with utility pockets on each leg. Slim-fit silhouette with tapered ankle. Water-resistant nylon-cotton blend with a matte finish and adjustable waistband.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&auto=format",
    tag: "Bestseller", rating: 4.9, reviews: 318, stock: 42,
  },
  {
    id: 3, name: "Oversized Denim Jacket", price: 185, category: "outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Vintage-washed denim with an oversized box fit. Heavy-duty brass buttons and reinforced seams. Two chest flap pockets, two hip pockets. Stonewashed for a lived-in character.",
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=750&fit=crop&auto=format",
    rating: 4.6, reviews: 89, stock: 23,
  },
  {
    id: 4, name: "Ribbed Knit Sweater", price: 95, category: "tops",
    sizes: ["S", "M", "L", "XL"],
    description: "Dense ribbed knit in a merino-cotton blend. Relaxed crew neck with a dropped hem. Seasonless construction for year-round layering. Available in three neutral colorways.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop&auto=format",
    tag: "New", rating: 4.7, reviews: 63, stock: 56,
  },
  {
    id: 5, name: "Wide-Leg Trousers", price: 135, category: "bottoms",
    sizes: ["XS", "S", "M", "L"],
    description: "High-waisted wide-leg silhouette in premium woven fabric. Pleated front, clean back seam, and side zip closure. Fully lined for a smooth fall. An elevated everyday essential.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b8927?w=600&h=750&fit=crop&auto=format",
    rating: 4.5, reviews: 201, stock: 67,
  },
  {
    id: 6, name: "Leather Belt Bag", price: 210, category: "accessories",
    sizes: ["One Size"],
    description: "Full-grain vegetable-tanned leather with a single zip closure. Adjustable strap fits up to 44\". Lined interior with card slot and key hook. Develops a unique patina over time.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&auto=format",
    rating: 4.9, reviews: 54, stock: 18,
  },
  {
    id: 7, name: "Tech Fleece Hoodie", price: 155, originalPrice: 195, category: "tops",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Engineered fleece with bonded seams and a hidden media pocket. Relaxed fit with storm-proof drawstring hood. Heavyweight construction that holds its shape wash after wash.",
    image: "https://images.unsplash.com/photo-1764069414793-c255766e3e9c?w=600&h=750&fit=crop&auto=format",
    tag: "Sale", rating: 4.8, reviews: 276, stock: 104,
  },
  {
    id: 8, name: "Low-Profile Sneakers", price: 180, category: "footwear",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    description: "Court-inspired silhouette with tumbled leather upper and memory foam insole. Vulcanized rubber outsole with herringbone grip pattern. Unlined for breathability.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&auto=format",
    rating: 4.7, reviews: 412, stock: 73,
  },
  {
    id: 9, name: "Cropped Blazer", price: 220, category: "outerwear",
    sizes: ["XS", "S", "M", "L"],
    description: "Structured cropped blazer in Italian wool-viscose blend. Single button closure, notched lapel, and fully lined interior. One welt chest pocket, two flap hip pockets.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=750&fit=crop&auto=format",
    tag: "New", rating: 4.6, reviews: 38, stock: 29,
  },
  {
    id: 10, name: "Slim Raw Denim", price: 165, category: "bottoms",
    sizes: ["28", "30", "32", "34", "36"],
    description: "12oz selvedge denim woven on vintage shuttle looms. Slim through thigh with a tapered ankle. Sanforized for minimal shrinkage. Develops deep fades with consistent wear.",
    image: "https://images.unsplash.com/photo-1542219550-37153d387c27?w=600&h=750&fit=crop&auto=format",
    rating: 4.8, reviews: 154, stock: 46,
  },
  {
    id: 11, name: "Canvas Bucket Hat", price: 55, category: "accessories",
    sizes: ["S/M", "L/XL"],
    description: "Six-panel bucket hat in washed cotton canvas. Structured brim with tonal stitching and minimalist embroidered logo at front. Adjustable chin strap with cord lock.",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=750&fit=crop&auto=format",
    rating: 4.4, reviews: 97, stock: 91,
  },
  {
    id: 12, name: "Longline Trench Coat", price: 340, category: "outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Classic trench in water-repellent gabardine. Double-breasted front, adjustable waist belt, epaulettes, and storm flap back yoke. Fully lined with a hidden storm zip.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop&auto=format",
    tag: "Bestseller", rating: 4.9, reviews: 183, stock: 15,
  },
];

const CATEGORIES = ["All", "tops", "bottoms", "outerwear", "accessories", "footwear"];
const PRICE_RANGES = ["All Prices", "Under $50", "$50–$100", "$100–$200", "$200+"];
const FILTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-border text-border"}
        />
      ))}
    </div>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    New: "bg-foreground text-background",
    Sale: "bg-red-600 text-white",
    Bestseller: "bg-stone-700 text-white",
  };
  return (
    <span className={`text-[9px] font-semibold tracking-[0.12em] uppercase px-2 py-1 ${colors[tag] ?? "bg-foreground text-background"}`}>
      {tag}
    </span>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  navigate: (p: Page, id?: number) => void;
  addToCart: (p: Product, size: string) => void;
  size?: "sm" | "md";
}

function ProductCard({ product, navigate, addToCart, size = "md" }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate("product", product.id)}
    >
      <div className="relative aspect-[4/5] bg-muted overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        {product.tag && (
          <div className="absolute top-3 left-3">
            <TagBadge tag={product.tag} />
          </div>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] font-semibold tracking-[0.15em] uppercase py-3.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          {added ? <><Check size={11} /> Added</> : "Quick Add"}
        </button>
      </div>
      <div>
        <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1.5">
          {product.category}
        </p>
        <p className={`font-medium mb-1 ${size === "sm" ? "text-xs" : "text-sm"}`}>{product.name}</p>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

interface NavbarProps {
  page: Page;
  navigate: (p: Page, id?: number) => void;
  cartCount: number;
}

function Navbar({ page, navigate, cartCount }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const navLinks = [
    { label: "Home", p: "home" as Page },
    { label: "Shop", p: "catalog" as Page },
    { label: "New Arrivals", p: "catalog" as Page },
    { label: "Sale", p: "catalog" as Page },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("home")}
          className="text-base font-black tracking-[0.4em] hover:opacity-60 transition-opacity shrink-0"
        >
          DRIP
        </button>

        <div className="flex items-center gap-8">
          {navLinks.map(({ label, p }) => (
            <button
              key={label}
              onClick={() => navigate(p)}
              className={`text-[13px] tracking-wide transition-opacity hover:opacity-60 ${
                page === p && label !== "New Arrivals" && label !== "Sale" ? "font-semibold" : "font-normal"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {searchOpen ? (
            <div className="flex items-center gap-2 border-b border-foreground pb-0.5">
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { navigate("catalog"); setSearchOpen(false); }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search products..."
                className="text-sm w-44 bg-transparent outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="hover:opacity-60 transition-opacity">
              <Search size={17} strokeWidth={1.75} />
            </button>
          )}

          <button onClick={() => navigate("cart")} className="relative hover:opacity-60 transition-opacity">
            <ShoppingBag size={17} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("login")}
            className="text-[11px] font-semibold tracking-[0.12em] uppercase border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("admin")}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  const shop = ["New Arrivals", "Tops", "Bottoms", "Outerwear", "Accessories", "Footwear", "Sale"];
  const company = ["About", "Sustainability", "Careers", "Press", "Contact"];
  const support = ["FAQ", "Shipping & Returns", "Size Guide", "Care Instructions", "Track Order"];

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-10">
        <div className="grid grid-cols-5 gap-10 mb-14">
          <div className="col-span-2">
            <p className="text-base font-black tracking-[0.4em] mb-5">DRIP</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Minimal clothing for the modern individual. Quality over quantity — every piece is made to last, designed to move.
            </p>
            <div className="flex gap-3 mt-6">
              {["IG", "TW", "TK", "PH"].map((s) => (
                <button
                  key={s}
                  className="w-8 h-8 border border-border text-[10px] font-semibold tracking-widest hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5">Shop</p>
            <ul className="space-y-3">
              {shop.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => navigate("catalog")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5">Company</p>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item}>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5">Support</p>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item}>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2025 DRIP. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <button key={item} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

interface HomePageProps {
  navigate: (p: Page, id?: number) => void;
  addToCart: (p: Product, size: string) => void;
  recentlyViewed: number[];
}

function HomePage({ navigate, addToCart, recentlyViewed }: HomePageProps) {
  const featured = PRODUCTS.slice(0, 8);
  const recent = PRODUCTS.filter((p) => recentlyViewed.includes(p.id));
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] overflow-hidden bg-stone-200">
        <img
          src="https://images.unsplash.com/photo-1764698192249-641a17d7a4fe?w=1440&h=960&fit=crop&auto=format"
          alt="DRIP Spring Summer 2025 Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-[1440px] mx-auto px-12 pb-20">
          <p className="text-white/70 text-[10px] tracking-[0.5em] uppercase mb-5 font-medium">
            Spring / Summer 2025
          </p>
          <h1 className="text-white text-[84px] font-black leading-[0.88] tracking-[-0.02em] mb-8 uppercase">
            Made<br />to Move.
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("catalog")}
              className="flex items-center gap-3 bg-white text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Collection <ArrowRight size={13} />
            </button>
            <button
              onClick={() => navigate("catalog")}
              className="text-white/80 text-[11px] font-medium tracking-[0.15em] uppercase border border-white/30 px-8 py-4 hover:border-white hover:text-white transition-colors"
            >
              New Arrivals
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 right-12 text-white/40 text-[10px] tracking-widest uppercase">
          Scroll to explore
        </div>
      </section>

      {/* Marquee strip */}
      <div className="bg-foreground text-background py-3 overflow-hidden">
        <div className="flex gap-12 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[10px] tracking-[0.35em] uppercase font-medium opacity-70 shrink-0">
              Free shipping over $150 &nbsp;·&nbsp; Easy returns &nbsp;·&nbsp; Sustainably made &nbsp;·&nbsp; New season drop now live
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Curated Selection
            </p>
            <h2 className="text-3xl font-black tracking-tight">Featured Products</h2>
          </div>
          <button
            onClick={() => navigate("catalog")}
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase hover:gap-3 transition-all duration-200 group"
          >
            View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-6 gap-y-10">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="max-w-[1440px] mx-auto px-8 mb-20">
        <div className="relative h-[420px] bg-stone-100 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1584998299263-ec3c4e0fb6de?w=1440&h=500&fit=crop&auto=format"
            alt="New arrivals editorial"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-between px-16">
            <div>
              <p className="text-white/60 text-[10px] tracking-[0.45em] uppercase mb-3 font-medium">
                Limited Edition
              </p>
              <h2 className="text-white text-5xl font-black tracking-tight leading-tight uppercase mb-2">
                New Season<br />Drop
              </h2>
              <p className="text-white/70 text-sm mt-3 max-w-xs leading-relaxed">
                Fresh silhouettes, elevated basics, and statement pieces for the new season.
              </p>
            </div>
            <button
              onClick={() => navigate("catalog")}
              className="border border-white/50 text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-white hover:text-foreground transition-colors"
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recent.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-[1440px] mx-auto px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Your History
                </p>
                <h2 className="text-2xl font-black tracking-tight">Recently Viewed</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollBy(-1)}
                  className="w-9 h-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  className="w-9 h-9 border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {recent.map((product) => (
                <div key={product.id} className="min-w-[220px] max-w-[220px]">
                  <ProductCard product={product} navigate={navigate} addToCart={addToCart} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="max-w-[1440px] mx-auto px-8 py-16">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">Browse</p>
        <h2 className="text-2xl font-black tracking-tight mb-10">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tops", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=400&fit=crop&auto=format" },
            { label: "Bottoms", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=400&fit=crop&auto=format" },
            { label: "Outerwear", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=400&fit=crop&auto=format" },
          ].map(({ label, img }) => (
            <button
              key={label}
              onClick={() => navigate("catalog")}
              className="relative h-64 overflow-hidden bg-muted group"
            >
              <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-left">
                  <p className="text-white text-lg font-black tracking-tight uppercase">{label}</p>
                  <p className="text-white/70 text-[11px] tracking-wider mt-0.5 flex items-center gap-1.5 font-medium">
                    Shop now <ArrowRight size={10} />
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Catalog Page ─────────────────────────────────────────────────────────────

interface CatalogPageProps {
  navigate: (p: Page, id?: number) => void;
  addToCart: (p: Product, size: string) => void;
}

function CatalogPage({ navigate, addToCart }: CatalogPageProps) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All Prices");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Featured");
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = search.length > 1
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const priceFilter = (price: number) => {
    if (priceRange === "All Prices") return true;
    if (priceRange === "Under $50") return price < 50;
    if (priceRange === "$50–$100") return price >= 50 && price <= 100;
    if (priceRange === "$100–$200") return price > 100 && price <= 200;
    if (priceRange === "$200+") return price > 200;
    return true;
  };

  const toggleSize = (s: string) => {
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    const matchPrice = priceFilter(p.price);
    const matchSize = selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s));
    return matchCat && matchSearch && matchPrice && matchSize;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  const clearFilters = () => {
    setCategory("All");
    setPriceRange("All Prices");
    setSelectedSizes([]);
    setSearch("");
  };

  const hasFilters = category !== "All" || priceRange !== "All Prices" || selectedSizes.length > 0;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-20">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">DRIP</p>
        <h1 className="text-3xl font-black tracking-tight">All Products</h1>
      </div>

      {/* Search bar */}
      <div ref={searchRef} className="relative mb-8">
        <div className="flex items-center gap-3 border border-border bg-card px-4 py-3 focus-within:border-foreground transition-colors">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for products, categories, styles..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => { setSearch(""); setShowSuggestions(false); }}>
              <X size={13} className="text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-30 bg-background border border-border border-t-0 shadow-lg">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => { navigate("product", p.id); setShowSuggestions(false); setSearch(""); }}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-muted shrink-0" />
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{p.category} · ${p.price}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2">
                <SlidersHorizontal size={11} /> Filters
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 tracking-wide"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-7">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3 text-muted-foreground">Category</p>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left text-sm flex items-center justify-between py-1 transition-colors ${
                      category === cat ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="capitalize">{cat}</span>
                    {category === cat && <Check size={11} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-7 pt-6 border-t border-border">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3 text-muted-foreground">Price Range</p>
              <div className="space-y-2">
                {PRICE_RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setPriceRange(r)}
                    className={`w-full text-left text-sm flex items-center justify-between py-1 transition-colors ${
                      priceRange === r ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{r}</span>
                    {priceRange === r && <Check size={11} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pt-6 border-t border-border">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3 text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`text-[11px] font-medium px-2.5 py-1.5 border transition-colors ${
                      selectedSizes.includes(s)
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Sort:</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-medium border border-border bg-background px-3 py-2 pr-7 outline-none appearance-none cursor-pointer hover:border-foreground transition-colors"
                >
                  {["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-4xl mb-4">—</p>
              <p className="font-semibold mb-1">No products found</p>
              <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="text-sm font-medium underline underline-offset-2">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-6 gap-y-10">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────

interface ProductDetailProps {
  productId: number;
  navigate: (p: Page, id?: number) => void;
  addToCart: (p: Product, size: string) => void;
}

function ProductDetailPage({ productId, navigate, addToCart }: ProductDetailProps) {
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "care">("details");

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  useEffect(() => {
    setSelectedSize("");
    setAdded(false);
    setSizeError(false);
    setQuantity(1);
  }, [productId]);

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] text-muted-foreground mb-8 font-medium tracking-wide">
        <button onClick={() => navigate("home")} className="hover:text-foreground transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate("catalog")} className="hover:text-foreground transition-colors">Shop</button>
        <span>/</span>
        <span className="text-foreground capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-[1fr_480px] gap-16 mb-24">
        {/* Image */}
        <div className="aspect-[4/5] bg-muted overflow-hidden">
          <img
            src={product.image.replace("w=600", "w=900")}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="py-2">
          {product.tag && <div className="mb-4"><TagBadge tag={product.tag} /></div>}
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3 capitalize">
            {product.category}
          </p>
          <h1 className="text-4xl font-black tracking-tight leading-tight mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <Stars rating={product.rating} />
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-black">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="text-sm font-semibold text-red-600">
                Save ${product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase">Select Size</p>
              <button className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSize(s); setSizeError(false); }}
                  className={`min-w-[52px] px-3 py-2.5 border text-sm font-medium transition-colors ${
                    selectedSize === s
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-red-600 text-xs mt-2 font-medium">Please select a size to continue.</p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3">Quantity</p>
            <div className="flex items-center border border-border w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 text-sm font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all mb-3 ${
              added
                ? "bg-stone-700 text-white"
                : "bg-foreground text-background hover:bg-stone-800"
            }`}
          >
            {added ? <><Check size={15} /> Added to Cart</> : <><ShoppingBag size={15} /> Add to Cart</>}
          </button>
          <button className="w-full py-4 text-sm font-semibold tracking-[0.15em] uppercase border border-border hover:border-foreground transition-colors">
            Save to Wishlist
          </button>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            {[
              { label: "Free Returns", sub: "Within 30 days" },
              { label: "Free Shipping", sub: "Orders over $150" },
              { label: "Sustainably Made", sub: "Ethical production" },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-[11px] font-semibold tracking-wide">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex gap-0 border-b border-border mb-5">
              {(["details", "shipping", "care"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-semibold tracking-[0.15em] uppercase px-0 py-2 mr-7 border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "details" && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}
            {activeTab === "shipping" && (
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>Standard shipping: 3–5 business days ($8.99)</p>
                <p>Express shipping: 1–2 business days ($18.99)</p>
                <p>Free standard shipping on orders over $150.</p>
                <p>Orders placed before 2PM EST ship same day.</p>
              </div>
            )}
            {activeTab === "care" && (
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>Machine wash cold, gentle cycle.</p>
                <p>Tumble dry low or lay flat to dry.</p>
                <p>Do not bleach. Iron on low heat if needed.</p>
                <p>Dry clean acceptable.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                You May Also Like
              </p>
              <h2 className="text-2xl font-black tracking-tight">Related Products</h2>
            </div>
            <button
              onClick={() => navigate("catalog")}
              className="text-[11px] font-semibold tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────

interface CartPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  navigate: (p: Page, id?: number) => void;
}

function CartPage({ cart, setCart, navigate }: CartPageProps) {
  const updateQty = (id: number, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === id && i.selectedSize === size ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const remove = (id: number, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.selectedSize === size)));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 8.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-muted-foreground mb-6" />
        <h2 className="text-2xl font-black tracking-tight mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore our collection.
        </p>
        <button
          onClick={() => navigate("catalog")}
          className="bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-stone-800 transition-colors"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-24">
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1">DRIP</p>
        <h1 className="text-3xl font-black tracking-tight">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-12 items-start">
        {/* Items */}
        <div>
          <div className="grid grid-cols-[1fr_120px_120px_44px] gap-4 pb-3 border-b border-border text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="grid grid-cols-[1fr_120px_120px_44px] gap-4 items-center py-5">
                <div className="flex gap-4 items-start">
                  <button
                    onClick={() => navigate("product", item.id)}
                    className="w-20 h-24 bg-muted overflow-hidden shrink-0"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </button>
                  <div className="pt-1">
                    <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-1 capitalize">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold mb-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                    <p className="text-sm font-semibold mt-2">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center border border-border justify-self-center">
                  <button
                    onClick={() => updateQty(item.id, item.selectedSize, -1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.selectedSize, 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => remove(item.id, item.selectedSize)}
                  className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors justify-self-end"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <input
              placeholder="Promo code"
              className="flex-1 border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors bg-transparent"
            />
            <button className="px-6 py-3 border border-foreground text-sm font-semibold tracking-wide hover:bg-foreground hover:text-background transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-muted p-6 sticky top-24">
          <h2 className="text-sm font-black tracking-[0.15em] uppercase mb-6">Order Summary</h2>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 150 && (
              <p className="text-[11px] text-muted-foreground">
                Add ${(150 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (est.)</span>
              <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-baseline mb-6">
            <span className="font-black tracking-wide">Total</span>
            <span className="text-2xl font-black">${(total + total * 0.08).toFixed(2)}</span>
          </div>

          <button className="w-full bg-foreground text-background py-4 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors mb-3">
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate("catalog")}
            className="w-full py-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Shopping
          </button>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Secure checkout · SSL encrypted · PCI compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ navigate }: { navigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left panel */}
      <div className="relative bg-stone-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1584998331538-b80134d537ec?w=800&h=1000&fit=crop&auto=format"
          alt="DRIP editorial"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="text-white text-3xl font-black tracking-[0.3em] mb-3">DRIP</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Minimal clothing for the modern individual. Join over 90,000 members worldwide.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-16">
        <div className="w-full max-w-sm">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">Welcome back</p>
          <h1 className="text-3xl font-black tracking-tight mb-8">Sign In</h1>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold tracking-[0.15em] uppercase block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors bg-transparent placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[11px] font-semibold tracking-[0.15em] uppercase">Password</label>
                <button className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors bg-transparent placeholder:text-muted-foreground pr-10"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("home")}
            className="w-full bg-foreground text-background py-4 text-[11px] font-semibold tracking-[0.2em] uppercase mt-6 hover:bg-stone-800 transition-colors"
          >
            Sign In
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button className="w-full border border-border py-3.5 text-sm font-medium mt-4 hover:border-foreground transition-colors">
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("register")}
              className="text-foreground font-semibold underline underline-offset-2 hover:opacity-70"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

function RegisterPage({ navigate }: { navigate: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="relative bg-stone-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1762605135012-56a59a059e60?w=800&h=1000&fit=crop&auto=format"
          alt="DRIP editorial"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="text-white text-3xl font-black tracking-[0.3em] mb-3">DRIP</p>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Join the DRIP community. Get early access to new drops, exclusive offers, and free returns.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-16">
        <div className="w-full max-w-sm">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">Get started</p>
          <h1 className="text-3xl font-black tracking-tight mb-8">Create Account</h1>

          <div className="space-y-4">
            {([
              { key: "name", label: "Full Name", placeholder: "Alex Chen", type: "text" },
              { key: "email", label: "Email Address", placeholder: "alex@example.com", type: "email" },
              { key: "password", label: "Password", placeholder: "Min. 8 characters", type: "password" },
              { key: "confirm", label: "Confirm Password", placeholder: "Repeat password", type: "password" },
            ] as const).map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-[11px] font-semibold tracking-[0.15em] uppercase block mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={update(key)}
                  placeholder={placeholder}
                  className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors bg-transparent placeholder:text-muted-foreground"
                />
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 mt-5">
            <input type="checkbox" id="terms" className="mt-0.5 shrink-0" />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <button className="text-foreground underline underline-offset-2">Terms of Service</button>
              {" "}and{" "}
              <button className="text-foreground underline underline-offset-2">Privacy Policy</button>
            </label>
          </div>

          <button
            onClick={() => navigate("home")}
            className="w-full bg-foreground text-background py-4 text-[11px] font-semibold tracking-[0.2em] uppercase mt-6 hover:bg-stone-800 transition-colors"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("login")}
              className="text-foreground font-semibold underline underline-offset-2 hover:opacity-70"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [products, setProducts] = useState(PRODUCTS);

  const stats = [
    { label: "Total Revenue", value: "$48,291", change: "+12.4%", positive: true, icon: TrendingUp },
    { label: "Orders", value: "1,284", change: "+8.7%", positive: true, icon: Package },
    { label: "Customers", value: "9,031", change: "+3.2%", positive: true, icon: Users },
    { label: "Avg. Order Value", value: "$87.40", change: "-1.1%", positive: false, icon: BarChart3 },
  ];

  const navItems = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Products", icon: Package },
    { label: "Orders", icon: Eye },
    { label: "Customers", icon: Users },
    { label: "Settings", icon: Settings },
  ];

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <button
            onClick={() => navigate("home")}
            className="text-base font-black tracking-[0.4em] text-sidebar-foreground hover:opacity-70 transition-opacity"
          >
            DRIP
          </button>
          <p className="text-[10px] tracking-widest uppercase mt-1 opacity-40 font-medium">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                activeNav === label
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate("home")}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut size={15} />
            Back to Store
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="border-b border-border px-8 py-5 flex items-center justify-between bg-background sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-black tracking-tight">{activeNav}</h1>
            <p className="text-xs text-muted-foreground">Wednesday, May 21, 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground text-background text-xs font-bold flex items-center justify-center rounded-full">
              AM
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Alex Morgan</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {stats.map(({ label, value, change, positive, icon: Icon }) => (
              <div key={label} className="bg-card border border-border p-5">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">{label}</p>
                  <Icon size={14} className="text-muted-foreground" />
                </div>
                <p className="text-3xl font-black tracking-tight mb-1">{value}</p>
                <span className={`text-xs font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                  {change}
                </span>
                <span className="text-xs text-muted-foreground"> vs last month</span>
              </div>
            ))}
          </div>

          {/* Products table */}
          <div className="bg-card border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-black tracking-tight">Products</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-border px-3 py-2">
                  <Search size={12} className="text-muted-foreground" />
                  <input
                    placeholder="Search products..."
                    className="text-xs bg-transparent outline-none w-40 placeholder:text-muted-foreground"
                  />
                </div>
                <button className="bg-foreground text-background text-[11px] font-semibold tracking-[0.12em] uppercase px-4 py-2 flex items-center gap-2 hover:bg-stone-800 transition-colors">
                  <Plus size={11} /> Add Product
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-muted overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{product.name}</p>
                            {product.tag && <TagBadge tag={product.tag} />}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs capitalize text-muted-foreground font-medium">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-semibold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through ml-1.5">${product.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${product.stock < 20 ? "text-red-600" : "text-foreground"}`}>
                          {product.stock}
                        </span>
                        {product.stock < 20 && (
                          <span className="ml-1.5 text-[10px] text-red-500 font-medium">Low</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 ${
                          product.stock > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {product.stock > 0 ? "Active" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-red-600 hover:border-red-300 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {products.length} of {products.length} products
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={`w-7 h-7 text-xs font-medium border transition-colors ${
                      n === 1 ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background border border-border p-8 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-black tracking-tight mb-2">Delete Product</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete &quot;{products.find((p) => p.id === deleteId)?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-border text-sm font-semibold hover:border-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([7, 8, 9, 10, 11, 12]);

  const navigate = (p: Page, productId?: number) => {
    if (productId !== undefined) {
      setSelectedProductId(productId);
      setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const showNavbar = page !== "admin" && page !== "login" && page !== "register";
  const showFooter = ["home", "catalog", "product", "cart"].includes(page);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showNavbar && <Navbar page={page} navigate={navigate} cartCount={cartCount} />}
      <main className={showNavbar ? "pt-16" : ""}>
        {page === "home" && <HomePage navigate={navigate} addToCart={addToCart} recentlyViewed={recentlyViewed} />}
        {page === "catalog" && <CatalogPage navigate={navigate} addToCart={addToCart} />}
        {page === "product" && (
          <ProductDetailPage productId={selectedProductId} navigate={navigate} addToCart={addToCart} />
        )}
        {page === "cart" && <CartPage cart={cart} setCart={setCart} navigate={navigate} />}
        {page === "login" && <LoginPage navigate={navigate} />}
        {page === "register" && <RegisterPage navigate={navigate} />}
        {page === "admin" && <AdminDashboard navigate={navigate} />}
      </main>
      {showFooter && <Footer navigate={navigate} />}
    </div>
  );
}
