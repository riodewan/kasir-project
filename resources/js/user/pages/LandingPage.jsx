import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-800">
      {/* Navbar */}
      <header className="fixed w-full z-50 bg-white shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-600">CafeKu</h1>
          <ul className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <li><a href="#home" className="hover:text-blue-600">Home</a></li>
            <li><a href="#menu" className="hover:text-blue-600">Menu</a></li>
            <li><a href="#about" className="hover:text-blue-600">Tentang Kami</a></li>
            <li><a href="#contact" className="hover:text-blue-600">Kontak</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 bg-gray-100">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 space-y-4"
          >
            <h2 className="text-4xl font-bold leading-tight">
              Selamat Datang di <span className="text-blue-600">CafeKu</span>
            </h2>
            <p className="text-gray-600">
              Temukan kenikmatan kopi terbaik dan suasana nyaman di tempat kami. Santai, kerja, atau ngobrol – semua pas di CafeKu.
            </p>
            <a
              href="#menu"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Lihat Menu
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mt-8 md:mt-0"
          >
            <img
              src="https://cp4.100.com.tw/images/articles/202006/20/admin_49_1592644785_NIfLWWDmgF.jpg!t1000.jpg"
              alt="Hero Cafe"
              className="w-full rounded-lg shadow-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold mb-6">Menu Unggulan</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Cappuccino",
                img: "https://pngimg.com/uploads/cappuccino/cappuccino_PNG61.png",
              },
              {
                title: "Espresso",
                img: "https://static.vecteezy.com/system/resources/previews/023/438/448/original/espresso-coffee-cutout-free-png.png",
              },
              {
                title: "Dessert",
                img: "http://www.pngall.com/wp-content/uploads/7/Dessert-PNG-Photo.png",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <motion.img
            src="https://i0.wp.com/www.rachelenroute.com/wp-content/uploads/2019/05/cafe-35.jpg?fit=4127%2C2751"
            alt="About Cafe"
            className="rounded-lg shadow-md md:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-4">Tentang CafeKu</h3>
            <p className="text-gray-600">
              CafeKu adalah tempat di mana kopi dan kreativitas bertemu. Kami menyajikan minuman berkualitas tinggi dan makanan ringan yang dibuat dengan penuh cinta oleh barista terbaik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold mb-4">Kontak Kami</h3>
          <p className="text-gray-600 mb-6">
            Kunjungi kami langsung atau hubungi melalui media sosial untuk informasi lebih lanjut.
          </p>
          <a
            href="https://wa.me/628123456789"
            target="_blank"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} CafeKu. All rights reserved.</p>
      </footer>
    </div>
  );
}
