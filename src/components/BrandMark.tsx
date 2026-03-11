interface BrandMarkProps {
  alt?: string;
  className?: string;
  decorative?: boolean;
}

export default function BrandMark({
  alt = 'Atelier 21',
  className = 'h-8 w-8',
  decorative = false,
}: BrandMarkProps) {
  return (
    <img
      src="/branding/logo-cupcake.svg"
      alt={decorative ? '' : alt}
      aria-hidden={decorative || undefined}
      className={className}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}
