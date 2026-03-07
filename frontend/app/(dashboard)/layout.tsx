import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </>
    );
}
