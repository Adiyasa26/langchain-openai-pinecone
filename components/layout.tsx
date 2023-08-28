import Image from 'next/image';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-4 w-full">
      <header className="sticky top-0 z-40 bg-white w-full">
        <div className="h-16 border-b border-b-slate-200 flex items-center justify-center w-full">
          <Image
            src="/leren.jpg"
            alt="leren"
            width="640"
            height="640"
            className="w-28 h-14 object-cover"
            priority
          />
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden items-center">
          {children}
        </main>
      </div>
    </div>
  );
}
