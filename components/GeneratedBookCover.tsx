interface GeneratedBookCoverProps {
  titleAr: string;
  author?: string;
}

export function GeneratedBookCover({ titleAr, author }: GeneratedBookCoverProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #061428 0%, #0A3060 60%, #0A4F8F 100%)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px)",
        }}
      />

      {/* Decorative circle 1 — large background circle */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "120%",
          aspectRatio: "1",
          top: "-30%",
          right: "-40%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      />

      {/* Decorative circle 2 — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "80%",
          aspectRatio: "1",
          bottom: "-25%",
          left: "-30%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Gold top bar */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)",
          flexShrink: 0,
        }}
      />

      {/* Three gold dots */}
      <div className="flex justify-center gap-1.5 pt-2 pb-1 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(201,168,76,0.7)",
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="flex-1 flex items-center justify-center px-3">
        <p
          className="text-white text-center font-bold text-sm leading-relaxed"
          style={{
            fontFamily: "Cairo, sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {titleAr}
        </p>
      </div>

      {/* Gold thin divider */}
      <div
        className="mx-4 flex-shrink-0"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
        }}
      />

      {/* Author */}
      {author && (
        <p
          className="text-center text-xs px-3 pt-1.5 pb-1 flex-shrink-0"
          style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Cairo, sans-serif" }}
        >
          {author}
        </p>
      )}

      {/* Bottom club label */}
      <div
        className="flex-shrink-0 flex items-center justify-center py-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
      >
        <span
          className="text-[9px] tracking-wide"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Cairo, sans-serif" }}
        >
          نادي إنجاز للقراءة
        </span>
      </div>
    </div>
  );
}
