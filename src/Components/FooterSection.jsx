import React from "react";
import Footer from "./Footer";

const FooterSection = () => {
  return (
    <>
      <section className="bg-neutral-900 text-white text-center py-16 px-4 mt-20">
        <Footer />
      </section>

      <footer className="bg-gray-600 text-white py-6 px-4 text-sm text-center">
        <div className="space-x-4">
          <div className="mb-2">&copy; {new Date().getFullYear()} NovaRide. All rights reserved.</div>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Help</a>
          <a href="/admin" className="hover:text-white">Career</a>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;