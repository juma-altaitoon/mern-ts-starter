import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';
import type { Message } from '@/types/message';
import { getUsers, getMessages } from '@/features/admin/adminService';
import { Button } from '@/components/ui/button';

const tabs = ['Users', 'Messages', 'Admin Settings', 'Analytics'] as const;

type DashboardTab = (typeof tabs)[number];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('Users');

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getUsers,
    staleTime: 1000 * 60,
  });

  const messagesQuery = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: getMessages,
    staleTime: 1000 * 60,
  });

  const users = usersQuery.data?.users ?? [];
  const messages = messagesQuery.data?.messages ?? [];

  const unreadMessagesCount = messages.filter((message) => !message.read).length;

  const pageSummary = (
    <div className="grid gap-6 xl:grid-cols-4">
      <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Total users</p>
        <p className="mt-4 text-3xl font-semibold text-(--text)">{users.length}</p>
        <p className="mt-2 text-sm text-(--muted)">Active users in your system.</p>
      </article>

      <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Messages</p>
        <p className="mt-4 text-3xl font-semibold text-(--text)">{messages.length}</p>
        <p className="mt-2 text-sm text-(--muted)">Contact submissions received.</p>
      </article>

      <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Unread items</p>
        <p className="mt-4 text-3xl font-semibold text-(--text)">{unreadMessagesCount}</p>
        <p className="mt-2 text-sm text-(--muted)">Messages that still need review.</p>
      </article>

      <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Admin tools</p>
        <p className="mt-4 text-3xl font-semibold text-(--text)">4 sections</p>
        <p className="mt-2 text-sm text-(--muted)">Use the tabs to switch between admin views.</p>
      </article>
    </div>
  );

  const renderUsersTable = (usersList: User[]) => {
    if (usersQuery.isPending) {
      return <p className="text-sm text-(--muted)">Loading users...</p>;
    }

    if (usersList.length === 0) {
      return <p className="text-sm text-(--muted)">No users are available yet.</p>;
    }

    return (
      <div className="overflow-hidden rounded-3xl border border-(--border) bg-(--surface) shadow-sm">
        <table className="min-w-full divide-y divide-(--border)">
          <thead className="bg-(--surface-strong)">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {usersList.map((user) => (
              <tr key={user._id ?? user.id ?? user.email}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--text)">{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--muted)">{user.email ?? 'Unknown'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--text)">{user.role ?? 'user'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--muted)">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMessagesTable = (messageList: Message[]) => {
    if (messagesQuery.isPending) {
      return <p className="text-sm text-(--muted)">Loading messages...</p>;
    }

    if (messageList.length === 0) {
      return <p className="text-sm text-(--muted)">No contact messages have been submitted yet.</p>;
    }

    return (
      <div className="overflow-hidden rounded-3xl border border-(--border) bg-(--surface) shadow-sm">
        <table className="min-w-full divide-y divide-(--border)">
          <thead className="bg-(--surface-strong)">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">From</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Message</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {messageList.map((message) => (
              <tr key={message._id ?? message.id ?? message.email}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--text)">{message.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--muted)">{message.email}</td>
                <td className="px-6 py-4 text-sm text-(--muted)">{message.content.length > 90 ? `${message.content.slice(0, 90)}...` : message.content}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-(--muted)">{message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 py-10">
      <section className="rounded-[2rem] border border-(--border) bg-(--surface) p-8 shadow-2xl shadow-(--shadow)">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Admin dashboard</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-(--text)">Control center for site administrators</h1>
            <p className="mt-3 max-w-2xl text-(--muted) leading-7">
              Monitor users, review incoming contact messages, and explore the mock admin settings and analytics views.
              This page is designed for clarity, quick scanning, and future expansion.
            </p>
          </div>
          <div className="rounded-3xl border border-(--border) bg-(--surface-strong) px-5 py-4 text-sm text-(--muted)">
            Updated in real time when backend data is available.
          </div>
        </div>
      </section>

      {pageSummary}

      <section className="rounded-[2rem] border border-(--border) bg-(--surface) p-6 shadow-2xl shadow-(--shadow)">
        <div className="flex flex-wrap items-center gap-3 border-b border-(--border) pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab}
              type="button"
              variant={tab === activeTab ? 'secondary' : 'outline'}
              size="default"
              className={`rounded-3xl px-4 py-2 text-sm ${tab === activeTab ? 'bg-(--accent) text-(--surface)' : 'text-(--text)'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === 'Users' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-(--text)">Users</h2>
                  <p className="text-sm text-(--muted)">A clean overview of the registered user base.</p>
                </div>
                <p className="text-sm text-(--muted)">{users.length} users loaded.</p>
              </div>
              {renderUsersTable(users)}
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-(--text)">Messages</h2>
                  <p className="text-sm text-(--muted)">Review incoming contact submissions from site visitors.</p>
                </div>
                <p className="text-sm text-(--muted)">{messages.length} messages, {unreadMessagesCount} unread.</p>
              </div>
              {renderMessagesTable(messages)}
            </div>
          )}

          {activeTab === 'Admin Settings' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
                <h2 className="text-xl font-semibold text-(--text)">Mock Admin Settings</h2>
                <p className="mt-3 text-sm leading-7 text-(--muted)">
                  This section is a placeholder for future platform settings, user management controls, and access policies.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-(--text)">
                  <li className="rounded-3xl border border-(--border) bg-(--surface) p-4">Manage account roles and permissions.</li>
                  <li className="rounded-3xl border border-(--border) bg-(--surface) p-4">Configure message review workflows.</li>
                  <li className="rounded-3xl border border-(--border) bg-(--surface) p-4">Audit login and usage settings.</li>
                </ul>
              </article>
              <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
                <h3 className="text-lg font-semibold text-(--text)">Design notes</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">
                  Use this tab to surface the configuration options that matter most to admins while keeping controls grouped and easy to scan.
                </p>
              </article>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="grid gap-6 xl:grid-cols-3">
              <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Traffic</p>
                <p className="mt-4 text-3xl font-semibold text-(--text)">+12%</p>
                <p className="mt-2 text-sm text-(--muted)">Visitor activity over the last 7 days.</p>
              </article>
              <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Engagement</p>
                <p className="mt-4 text-3xl font-semibold text-(--text)">8.4 / 10</p>
                <p className="mt-2 text-sm text-(--muted)">Average message response sentiment.</p>
              </article>
              <article className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Health</p>
                <p className="mt-4 text-3xl font-semibold text-(--text)">Good</p>
                <p className="mt-2 text-sm text-(--muted)">Mock analytics for admin visibility.</p>
              </article>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
