import { Suspense } from "react";

import ChatPage from "./chatPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatPage />
    </Suspense>
  );
}