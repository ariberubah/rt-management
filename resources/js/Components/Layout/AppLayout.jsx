import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Home,
    Users,
    CreditCard,
    Receipt,
    Tag,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Toast from '@/Components/ui/Toast';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Rumah', href: '/houses', icon: Home },
    { label: 'Penghuni', href: '/residents', icon: Users },
    { label: 'Tagihan', href: '/billing-periods', icon: CreditCard },
    { label: 'Pengeluaran', href: '/expenses', icon: Receipt },
    { label: 'Kategori', href: '/expense-categories', icon: Tag },
];

export default function AppLayout({ children, title }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Toast/>
            {/* Sidebar */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200',
                'lg:translate-x-0 lg:static lg:z-auto',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Home size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">RT Management</p>
                        <p className="text-xs text-gray-500">Perumahan Elite</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">v1.0.0</p>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4">
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}