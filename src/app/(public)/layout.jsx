export default function BlankLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">{children}</div>
    </>
  );
}
