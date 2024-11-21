import { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'edge-csrf html form submission example',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
