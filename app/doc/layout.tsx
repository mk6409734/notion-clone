import LiveBlockProvider from "@/components/LiveBlockProvider";

export default function Pagelayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
}
