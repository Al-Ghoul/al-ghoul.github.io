import { permanentRedirect, RedirectType } from "next/navigation";

export default async function IndexPage() {
  permanentRedirect("/ar", RedirectType.replace);
}
