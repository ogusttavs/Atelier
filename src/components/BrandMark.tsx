interface BrandMarkProps {
  alt?: string;
  decorative?: boolean;
  iconClassName?: string;
  wrapperClassName?: string;
}

export default function BrandMark({
  alt = 'Atelier 21',
  decorative = false,
  iconClassName = 'h-6 w-6',
  wrapperClassName = 'rounded-[10px] p-1',
}: BrandMarkProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-[#FFF5F7] ring-1 ring-[#E295A3]/35 shadow-[0_6px_18px_rgba(74,51,56,0.08)] ${wrapperClassName}`}
    >
      <img
        src="/branding/logo-cupcake.svg"
        alt={decorative ? '' : alt}
        aria-hidden={decorative || undefined}
        className={iconClassName}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
