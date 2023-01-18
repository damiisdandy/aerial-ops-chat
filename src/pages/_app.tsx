import type { AppType } from "next/app";
import { trpc } from "~/utils/trpc";
import "~/styles/global.css";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import Layout from "~/components/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <NotificationsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default trpc.withTRPC(MyApp);
