interface PagamentoProps {
  url: string;
}

export default function Pagamento({ url }: PagamentoProps) {
  return <>{url.length > 0 && <iframe src={url}></iframe>}</>;
}
