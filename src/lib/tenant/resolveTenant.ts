export type ResolvedTenant = {
  kind: "flagship" | "platform" | "creator";
  hostname: string;
  shopSlug: string;
  creatorSubdomain?: string;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function normalizeHost(hostHeader: string | null | undefined) {
  return (hostHeader ?? "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/:\d+$/, "")
    .trim();
}

export function resolveTenantFromHost(hostHeader: string | null | undefined): ResolvedTenant | null {
  const hostname = normalizeHost(hostHeader);

  if (!hostname || LOCAL_HOSTS.has(hostname) || hostname.endsWith(".localhost")) {
    return {
      kind: "flagship",
      hostname: hostname || "localhost",
      shopSlug: "footprintshub",
    };
  }

  if (
    hostname === "footprintshub.com" ||
    hostname === "www.footprintshub.com" ||
    hostname === "footprintshub.test" ||
    hostname === "footprintshub.com.test"
  ) {
    return {
      kind: "flagship",
      hostname,
      shopSlug: "footprintshub",
    };
  }

  if (hostname === "shop.herostudio.org") {
    return {
      kind: "platform",
      hostname,
      shopSlug: "hero-studio",
    };
  }

  if (hostname.endsWith(".herostudio.org")) {
    const creatorSubdomain = hostname.replace(".herostudio.org", "");

    if (!creatorSubdomain || creatorSubdomain === "www") {
      return null;
    }

    return {
      kind: "creator",
      hostname,
      shopSlug: creatorSubdomain,
      creatorSubdomain,
    };
  }

  return null;
}
