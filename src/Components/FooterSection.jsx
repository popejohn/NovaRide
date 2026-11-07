import React from "react";
import Footer from "./Footer";

const FooterSection = () => {
  return (
    <>
      <section className="bg-neutral-900 text-white text-center py-8 sm:py-16 page-gutter sm:px-4 mt-10 sm:mt-20">
        <Footer />
      </section>

      <footer className="bg-neutral-900 text-white py-3 sm:py-6 px-4 text-sm text-center">
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



