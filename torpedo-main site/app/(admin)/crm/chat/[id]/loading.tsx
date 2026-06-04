export default function CRMChatLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-32 rounded-lg bg-gray-200" />
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-12 rounded-lg ${i % 2 === 0 ? 'ml-8 bg-[#FF4F00]/10' : 'mr-8 bg-gray-100'}`}
            />
          ))}
        </div>
      </div>
      <div className="h-12 rounded-xl bg-gray-100" />
    </div>
  );
}
