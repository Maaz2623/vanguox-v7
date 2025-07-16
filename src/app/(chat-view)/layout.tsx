import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { ChatViewSidebar } from "@/modules/chat/ui/components/chat-view-sidebar";
import { ChatViewSiteHeader } from "@/modules/chat/ui/components/chat-view-site-header";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { MessageForm } from "@/modules/messages/ui/components/message-form";
import { headers } from "next/headers";

export default async function ChatViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {!data ? (
        <HomeView />
      ) : (
        <SidebarProvider
          className="dark:bg-neutral-900 bg-neutral-100 h-screen"
          // style={
          //   {
          //     "--sidebar-width": "calc(var(--spacing) * 72)",
          //     "--header-height": "calc(var(--spacing) * 12)",
          //   } as React.CSSProperties
          // }
        >
          <ChatViewSidebar
            auth={true}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image}
            variant="inset"
            className="border-r border-neutral-200 dark:border-neutral-800"
          />
          <SidebarInset className="bg-transparent relative shadow-none! m-0! rounded-none! border-none!">
            <ChatViewSiteHeader />
            {children}
            
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
