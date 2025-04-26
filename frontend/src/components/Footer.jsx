import {
  Heart,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary-light/20 to-accent-blue/20 py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-12 text-left">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-primary text-[#a391f5]">
              <Heart className="h-6 w-6" />
              <span className="text-lg font-semibold">MindMosaic</span>
            </div>
            <p className="text-gray-600">
              Your AI-Powered Mental Wellness Companion. Providing
              compassionate, personalized support for your emotional journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <nav className="space-y-4 text-gray-600">
              <div>Home</div>
              <div>About</div>
              <div>Features</div>
              <div>Contact</div>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Connected</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@mindmosaic.ai</span>
              </div>

              <div className="flex space-x-4 mt-4">
                <Facebook className="h-6 w-6 text-gray-600 hover:text-primary transition-colors" />
                <Instagram className="h-6 w-6 text-gray-600 hover:text-primary transition-colors" />
                <Twitter className="h-6 w-6 text-gray-600 hover:text-primary transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-600 hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-[#a391f5]">
          © {currentYear} MindMosaic. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;