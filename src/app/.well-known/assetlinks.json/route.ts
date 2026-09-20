/**
 * Vérifie l'APK Android (Trusted Web Activity) auprès du site.
 * PWABuilder affiche une empreinte SHA-256 au moment de générer l'APK :
 * colle-la dans FINGERPRINTS ci-dessous, et mets le nom de package exact.
 */
const PACKAGE_NAME = "com.teranga.campus.twa";

const FINGERPRINTS: string[] = [
  // "AA:BB:CC:...:FF", // <- empreinte SHA-256 de PWABuilder
];

export async function GET() {
  return Response.json(
    FINGERPRINTS.map((fp) => ({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: [fp],
      },
    })),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
