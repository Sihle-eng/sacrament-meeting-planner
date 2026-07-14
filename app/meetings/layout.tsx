export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Optional: Add a sub-header or sidebar here if needed */}
      {children}
    </section>
  );
}