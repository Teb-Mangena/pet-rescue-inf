import { PawPrint } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-bone">
            <PawPrint className="w-4 h-4" />
          </span>
          <span className="font-display font-black">Pet Rescue</span>
        </div>
        <div className="flex flex-wrap gap-6 text-stone">
          <a href="#" className="hover:text-ink transition-colors">
            About
          </a>
          <a href="#" className="hover:text-ink transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-ink transition-colors">
            Contact
          </a>
          <a href="#" className="hover:text-ink transition-colors">
            For Shelters
          </a>
        </div>
        <div className="text-stone">
          © {new Date().getFullYear()} Pet Rescue
        </div>
      </div>
    </footer>
  );
}

export default Footer;
