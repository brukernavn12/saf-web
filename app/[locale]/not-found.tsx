import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-4xl text-primary">404</h1>
      <p className="mt-4 text-text/70">Siden finnes ikke.</p>
      <Link href="/" className="mt-8 text-accent hover:underline">
        Til forsiden
      </Link>
    </div>
  );
}
