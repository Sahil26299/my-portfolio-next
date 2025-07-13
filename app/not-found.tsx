import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <section className="flex items-center gap-3 select-none">
        <h2 className="text-lg-1">404Not Found</h2>
        <div className="h-10 bg-dark_grey w-px" />
        <section className="flex items-center gap-1 text-md-1">
          <p className="text-dark_grey">Could not find requested resource.</p>
          <Link href="/" className="underline">Return Home</Link>
        </section>
      </section>
    </div>
  );
}
