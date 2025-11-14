import './globals.css';
import { Providers } from './providers';
import Header from './components/Header';

export const metadata = {
  title: 'Blog Dashboard',
  description: 'Learn React Server Components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="p-6 bg-gray-50 text-gray-900">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}