export default function Terms() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>
        <p className="text-gray-600 mb-4">
          Welcome to <strong>FreeLynx</strong>. By accessing and using our platform, you agree to comply with these terms and conditions.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-600">
          By registering or using FreeLynx, you confirm that you accept these terms and agree to abide by them. If you do not agree, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Eligibility</h2>
        <p className="text-gray-600">
          You must be at least 18 years old or have legal guardian consent to use FreeLynx.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Provide accurate, current, and complete information during registration and profile updates.</li>
          <li>Maintain the confidentiality of your account credentials and notify us immediately of any unauthorized use.</li>
          <li>Use the platform only for lawful purposes and not engage in activities that harm others or violate laws.</li>
          <li>You are responsible for all content you submit and must ensure it does not infringe on others' rights.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Intellectual Property</h2>
        <p className="text-gray-600">
          All content, trademarks, and logos on FreeLynx are the property of FreeLynx or its licensors. You may not use them without permission.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Termination</h2>
        <p className="text-gray-600">
          We reserve the right to suspend or terminate your account at our discretion if you violate these terms or engage in harmful activities.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">6. Disclaimer of Warranties</h2>
        <p className="text-gray-600">
          FreeLynx is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">7. Limitation of Liability</h2>
        <p className="text-gray-600">
          FreeLynx is not liable for any damages arising from your use of the platform, including data loss or business interruptions.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">8. Changes to Terms</h2>
        <p className="text-gray-600">
          We may update these terms occasionally. Continued use after changes means you accept the new terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">9. Governing Law</h2>
        <p className="text-gray-600">
          These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the appropriate courts there.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">10. Contact</h2>
        <p className="text-gray-600">
          For any questions regarding these terms, please contact us at{" "}
          <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>.
        </p>
      </div>
    </div>
  );
}
