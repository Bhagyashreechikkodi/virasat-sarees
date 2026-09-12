import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-charcoal">Product not found</h1>
      <p className="mt-2 text-sm text-muted">
        This saree may have been moved or is no longer available.
      </p>
      <Link
        href="/sarees"
        className="mt-6 inline-block rounded-md bg-burgundy px-5 py-2.5 text-sm font-medium text-white"
      >
        Back to Sarees
      </Link>
    </div>
  );
}
