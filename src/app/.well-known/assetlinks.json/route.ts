/**
 * Vérifie l'APK Android (Trusted Web Activity) auprès du site.
 * PWABuilder affiche une empreinte SHA-256 au moment de générer l'APK :
 * colle-la dans FINGERPRINTS ci-dessous, et mets le nom de package exact.
 */
const PACKAGE_NAME = "app.vercel.teranga_campus.twa";

const FINGERPRINTS: string[] = [
  "44:AF:94:B6:F7:03:AD:0B:E9:D8:DA:67:11:61:24:CE:3E:20:7F:CA:62:1E:B5:B6:BC:E6:B3:F3:94:FE:99:B2",
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
