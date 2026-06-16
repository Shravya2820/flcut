export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          Access Restricted
        </h1>

        <p className="text-gray-600">
          You are not part of the authorized FLC core committee.
          Contact current FLC leadership if you believe this is a mistake.
        </p>
      </div>
    </main>
  );
}