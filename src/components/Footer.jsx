export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 px-6 text-center text-sm text-gray-600">
      <div className="flex flex-col items-center space-y-4">

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
          <a
            href="/terms"
            className="font-medium hover:text-blue-600 transition"
            aria-label="Terms and Conditions"
          >
            Terms
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/privacy"
            className="font-medium hover:text-blue-600 transition"
            aria-label="Privacy Policy"
          >
            Privacy
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/contact"
            className="font-medium hover:text-blue-600 transition"
            aria-label="Contact Page"
          >
            Contact
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-8 text-gray-500 mt-3">
          <a
            href="https://fake-instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition transform hover:scale-110"
          >
            <i className="fab fa-instagram text-2xl"></i>
          </a>
          <a
            href="https://fake-twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition transform hover:scale-110"
          >
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a
            href="https://fake-facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition transform hover:scale-110"
          >
            <i className="fab fa-facebook text-2xl"></i>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} FreeLynx. All rights reserved.
        </p>

        {/* Developer Credit */}
        <p className="text-xs text-gray-400">
          Developed by{" "}
          <a
            href="https://sudiptakhanra.netlify.app/"
            className="hover:text-blue-500 underline transition"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sudipta Khanra Portfolio"
          >
            Sudipta Khanra
          </a>
        </p>
      </div>
    </footer>
  );
}
