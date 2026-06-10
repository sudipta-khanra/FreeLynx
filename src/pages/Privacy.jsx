export default function Privacy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">
          Your privacy is important to us at <strong>FreeLynx</strong>. This policy explains how we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Account information such as name, email, and profile details.</li>
          <li>Job postings, applications, and other content you provide.</li>
          <li>Usage data, including device information, IP addresses, and browsing behavior to improve our services.</li>
          <li>Cookies and tracking technologies to enhance user experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. How We Use Your Data</h2>
        <p className="text-gray-600">
          We use your data to provide, personalize, and improve our services, communicate with you, and ensure platform security.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Data Sharing</h2>
        <p className="text-gray-600">
          We do not sell your personal data. We may share information with trusted third-party service providers who help us operate the platform, under strict confidentiality agreements.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Data Protection</h2>
        <p className="text-gray-600">
          We use industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, correct, or delete your personal data. You can also opt out of certain data collection by contacting us.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">6. Cookies</h2>
        <p className="text-gray-600">
          We use cookies to improve your experience, analyze site usage, and support our marketing efforts. You can control cookie settings via your browser.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">7. Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. Continued use of FreeLynx after changes means you accept the updated policy.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">8. Contact Us</h2>
        <p className="text-gray-600">
          For questions about this policy or to request data access/deletion, please visit our{" "}
          <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>.
        </p>
      </div>
    </div>
  );
}
