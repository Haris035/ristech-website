import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Mic, Users, FileText, Wallet, Network, 
  ChevronRight, Award, Briefcase, User, Mail, MapPin, MessageCircle, ExternalLink 
} from 'lucide-react';

// --- Custom Hooks untuk Animasi ---

// Hook untuk Typing Effect
const useTypingEffect = (phrases, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[loopNum % phrases.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

// Hook untuk Scroll Reveal (Intersection Observer)
const useScrollReveal = (options = { threshold: 0.1 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, isVisible];
};

// --- Komponen Pembantu ---

const RevealSection = ({ children, className = '', delay = '' }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

// --- Komponen Utama Aplikasi ---

export default function PortfolioApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Daftar frasa untuk Hero section
  const typingPhrases = [
    "Public Speaker",
    "MC & Moderator",
    "Mahasiswi Komunikasi & Penyiaran Islam"
  ];
  const currentText = useTypingEffect(typingPhrases);

  // Efek scroll untuk Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Profil', href: '#profil' },
    { name: 'Keahlian', href: '#keahlian' },
    { name: 'Pengalaman', href: '#pengalaman' },
    { name: 'Prestasi', href: '#prestasi' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const scrollTo = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 scroll-smooth">
      {/* Warna Latar Belakang & Glow Ambien */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]"></div>
      </div>

      {/* 1. Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${
        scrolled ? 'bg-[#0A1128]/80 backdrop-blur-md py-3 shadow-lg shadow-black/20' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#beranda" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide" onClick={(e) => scrollTo(e, '#beranda')}>
            FHF.
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-300 hover:text-emerald-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A1128]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-slate-300 font-medium hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Konten Utama */}
      <main className="relative z-10">
        
        {/* 2. Hero Section */}
        <section id="beranda" className="min-h-screen flex items-center pt-20 pb-12">
          <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
            <RevealSection className="order-2 md:order-1 flex flex-col space-y-6">
              <div>
                <p className="text-emerald-400 font-medium mb-2 tracking-wider text-sm uppercase">Halo, Saya</p>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] leading-tight">
                  Farah Hasna <br className="hidden md:block"/> Fauziyah
                </h1>
                <div className="h-8 md:h-10">
                  <p className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    {currentText}
                    <span className="inline-block w-1 h-6 md:h-8 ml-1 bg-cyan-400 animate-pulse translate-y-1"></span>
                  </p>
                </div>
              </div>
              
              <blockquote className="text-slate-400 text-lg md:text-xl italic border-l-4 border-emerald-500/50 pl-4 py-1 bg-white/5 rounded-r-lg">
                "Belajar, bertumbuh, dan berjuang dengan tujuan, berlandaskan iman."
              </blockquote>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#kontak" onClick={(e) => scrollTo(e, '#kontak')} className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Hubungi Saya <MessageCircle size={18} />
                </a>
                <a href="#prestasi" onClick={(e) => scrollTo(e, '#prestasi')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-300 flex items-center gap-2">
                  Lihat Portofolio <ChevronRight size={18} />
                </a>
              </div>
            </RevealSection>

            <RevealSection className="order-1 md:order-2 flex justify-center md:justify-end" delay="delay-200">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                {/* Dekorasi Cahaya (Glow) Asimetris di Belakang Foto */}
                <div className="absolute inset-4 bg-gradient-to-tr from-emerald-400/30 to-cyan-500/30 blur-3xl rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-pulse"></div>
                
                {/* Area Placeholder untuk Foto Transparan (PNG) */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-cyan-400/30 rounded-2xl bg-transparent transition-all duration-300 hover:border-cyan-400/60 hover:bg-white/5">
                  {/* INFO: Hapus div/User icon di bawah ini, lalu ganti dengan tag img seperti: 
                      <img src="URL_FOTO.png" alt="Farah" className="w-full h-full object-contain drop-shadow-2xl" /> 
                  */}
                  <User size={80} className="text-cyan-400/40 mb-4 drop-shadow-lg" />
                  <span className="text-xs text-cyan-400/60 uppercase tracking-widest font-semibold text-center px-4 leading-relaxed">
                    [ Area Foto Transparan .PNG ] <br/> <span className="text-[10px] opacity-70">Glow akan menyorot dari belakang</span>
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* 3. Bagian Profil */}
        <section id="profil" className="py-24 relative">
          <div className="container mx-auto px-6 md:px-12">
            <RevealSection>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 flex-1"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-center">Tentang <span className="text-emerald-400">Saya</span></h2>
                <div className="h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 flex-1"></div>
              </div>
            </RevealSection>
            
            <RevealSection delay="delay-100">
              <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed text-center">
                  Mahasiswi Komunikasi dan Penyiaran Islam Universitas Ibn Khaldun Bogor yang aktif dalam kegiatan organisasi, kepanitiaan, public speaking, serta pengelolaan administrasi dan keuangan. Terbiasa menjadi MC/moderator, bekerja dalam tim, dan mengelola tugas dengan komunikatif serta bertanggung jawab.
                </p>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* 4. Bagian Keahlian */}
        <section id="keahlian" className="py-24 bg-black/20">
          <div className="container mx-auto px-6 md:px-12">
            <RevealSection>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Kompetensi & <span className="text-cyan-400">Keahlian</span></h2>
            </RevealSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: <Mic size={32} />, title: "Public Speaking & MC", desc: "Berpengalaman membawakan berbagai acara formal maupun non-formal." },
                { icon: <Users size={32} />, title: "Moderator & Event Comm", desc: "Memandu diskusi interaktif dan memfasilitasi komunikasi antar narasumber." },
                { icon: <FileText size={32} />, title: "Administrasi & Kesekretariatan", desc: "Merapikan dokumen, korespondensi, dan tata kelola organisasi." },
                { icon: <Wallet size={32} />, title: "Pengelolaan Keuangan / Petty Cash", desc: "Mengelola arus kas kecil dan pencatatan bendahara dengan teliti." },
                { icon: <Network size={32} />, title: "Kerja Tim & Koordinasi", desc: "Berkomunikasi secara efektif dan bertanggung jawab dalam kerja tim." }
              ].map((skill, index) => (
                <RevealSection key={index} delay={`delay-[${index * 100}ms]`}>
                  <div className="p-8 rounded-2xl bg-[#0A1128] border border-white/5 hover:border-emerald-500/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-all duration-300 group h-full">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                      {skill.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{skill.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{skill.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Bagian Pengalaman */}
        <section id="pengalaman" className="py-24">
          <div className="container mx-auto px-6 md:px-12">
            <RevealSection>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Jejak <span className="text-emerald-400">Pengalaman</span></h2>
            </RevealSection>

            <div className="max-w-4xl mx-auto relative">
              {/* Garis Vertikal */}
              <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/20 via-cyan-500/20 to-transparent md:-translate-x-1/2"></div>

              {[
                {
                  year: "2026 - Sekarang",
                  roles: [
                    "Tim Wedding Organizer (Alfath Planner)",
                    "Tim MC (Alfina MC)",
                    "Divisi Humas Ikatan Alumni PP Nurul Qur'an",
                    "Duta Pembicara Muda Indonesia Batch 3"
                  ],
                  align: "right"
                },
                {
                  year: "2026",
                  roles: [
                    "Bendahara HIMA KPI UIKA",
                    "Petty Cash Project (PT Nabawi Network Indonesia)"
                  ],
                  align: "left"
                },
                {
                  year: "2025 - Sekarang",
                  roles: [
                    "MC & Moderator di berbagai kegiatan",
                    "Sekretaris Masjid Malikal Mulki"
                  ],
                  align: "right"
                },
                {
                  year: "2023",
                  roles: [
                    "Sekretaris Divisi Pendidikan, OSQ PP Al-Qur'an Nurul Qur'an"
                  ],
                  align: "left"
                }
              ].map((exp, index) => (
                <RevealSection key={index} className="relative z-10 mb-12 last:mb-0">
                  <div className={`flex flex-col md:flex-row items-start ${exp.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Bagian Konten */}
                    <div className={`md:w-1/2 pl-12 md:pl-0 ${exp.align === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-4 border border-emerald-500/20">
                          {exp.year}
                        </span>
                        <ul className={`space-y-3 ${exp.align === 'left' ? 'md:items-end' : ''} flex flex-col`}>
                          {exp.roles.map((role, rIndex) => (
                            <li key={rIndex} className={`flex items-start gap-3 ${exp.align === 'left' ? 'md:flex-row-reverse md:gap-reverse' : ''}`}>
                              <Briefcase size={16} className={`mt-1 text-cyan-400 flex-shrink-0 ${exp.align === 'left' ? 'md:ml-3' : ''}`} />
                              <span className="text-slate-300 leading-snug">{role}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Titik Timeline */}
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-[#0A1128] border-4 border-emerald-500 transform md:-translate-x-1/2 mt-6 md:mt-0 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Bagian Prestasi */}
        <section id="prestasi" className="py-24 bg-black/20">
          <div className="container mx-auto px-6 md:px-12">
            <RevealSection>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Pencapaian & <span className="text-cyan-400">Prestasi</span></h2>
            </RevealSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                { year: "2025", title: "Juara 1 Lomba Badminton", desc: "CONFEST KPI" },
                { year: "2025", title: "Peserta Terbaik", desc: "LKKMM Fakultas Agama Islam" },
                { year: "2022-2023", title: "Juara 2 Syarhil Qur'an", desc: "Tingkat Kec. Kemang (2023) & Kab. Bogor (2022)" },
                { year: "2020-2021", title: "Juara Kaligrafi & Syarhil Qur'an", desc: "Juara 2 Kaligrafi & Juara 2, 3 Syarhil Qur'an PP Al-Qur'an Nurul Qur'an" }
              ].map((award, index) => (
                <RevealSection key={index} delay={`delay-[${index * 150}ms]`}>
                  <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:-translate-y-3 hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_15px_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col items-center text-center group cursor-default">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Award size={32} />
                    </div>
                    <span className="text-xs font-bold text-cyan-400 mb-2 tracking-widest">{award.year}</span>
                    <h3 className="text-lg font-bold text-white mb-2">{award.title}</h3>
                    <p className="text-sm text-slate-400 mt-auto">{award.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Kontak & Footer */}
        <section id="kontak" className="py-24 relative overflow-hidden">
          {/* Efek Latar Kontak */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none"></div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
            <RevealSection>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Mari Bekerja <span className="text-emerald-400">Sama</span></h2>
              <p className="text-lg text-slate-300 mb-12">
                Tertarik untuk berkolaborasi, mengundang sebagai MC/Moderator, atau mendiskusikan peluang lainnya? Jangan ragu untuk menghubungi saya!
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <a 
                  href="https://wa.me/6289633777030" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg hover:bg-[#1ebe5d] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <MessageCircle size={24} />
                  Hubungi via WhatsApp
                  <ExternalLink size={18} className="opacity-70" />
                </a>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400 text-sm md:text-base border-t border-white/10 pt-12">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-400" />
                  <span>Bilabong, Cimanggis, Bojonggede, Bogor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-cyan-400" />
                  <span>farahhasna@example.com</span> {/* Ganti email ini bila ada */}
                </div>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      {/* Footer Bawah */}
      <footer className="bg-[#050914] py-8 text-center border-t border-white/5">
        <p className="text-slate-500 text-sm">
          © 2026 Farah Hasna Fauziyah. <br className="md:hidden"/> Dibuat dengan ❤️ oleh <span className="text-emerald-500/70 font-semibold hover:text-emerald-400 cursor-pointer transition-colors">Ristech</span>.
        </p>
      </footer>
    </div>
  );
}