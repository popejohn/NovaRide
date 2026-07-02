import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

/**
 * Responsive Uber‑style footer component
 * Uses Tailwind CSS + lucide‑react icons
 */
const LinkGroup = ({ title, items }) => (
  <div className="space-y-2 min-w-[8rem]">
    <h3 className="font-semibold text-yellow-500 text-base mb-1">{title}</h3>
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item}>
          <a
            href="#"
            className="hover:underline hover:text-uber-green transition-colors"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Wrapper to constrain width & add horizontal padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          {/* Brand & help */}
          <div className="space-y-4">
            <a
              href="#"
              aria-label="NovaRide home"
              className="text-2xl font-bold"
            >
              NovaRide
            </a>
            <a
              href="#"
              className="block text-sm font-medium hover:underline hover:text-uber-green"
            >
              Visit Help Center
            </a>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 flex-grow">
            <LinkGroup
              title="Company"
              items={[
                "About us",
                "Our offerings",
                "Customer service",
                "Careers",
              ]}
            />
            <LinkGroup
              title="Products"
              items={[
                "Booke ride",
                "Rider",
                "Installment"
              ]}
            />
            <LinkGroup
              title="Your safety"
              items={["Safety", "Report rider"]}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-neutral-700" />

        {/* Bottom row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} NovaRide Inc.</p>
          <div className="flex gap-6">
            <a href="#" aria-label="Twitter" className="hover:text-uber-green">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-uber-green">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-uber-green">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-uber-green">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Tailwind custom color example (tailwind.config.js)
// colors: {
//   'uber-green': '#1ad761',
// }




