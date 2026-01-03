import infin8Logo from "../../../assets/events_page/infin8-logo.png";

export default function DefaultEventPoster({ title }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#071a26] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b2a3c]/90 via-[#071a26] to-[#020b11]" />

      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-15"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(100, 200, 255, 0.3) 50%, transparent 70%)",
        }}
      />

      <div
        className="absolute -top-[30%] -left-[30%] w-[200%] h-[200%] opacity-[0.09]"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(100, 200, 255, 0.3) 50%, transparent 70%)",
        }}
      />

      <div
        className="absolute -top-[40%] -left-[40%] w-[200%] h-[200%] opacity-[0.06]"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(100, 200, 255, 0.3) 50%, transparent 70%)",
        }}
      />

      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-10 w-[45%] max-w-[180px]">
        <img
          src={infin8Logo}
          alt="Infin8"
          className="w-full h-auto opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-[85%]">
        <h2
          className="font-['Cinzel',serif] text-[clamp(1.4rem,4vw,2.2rem)] font-bold text-[#eaf6ff] tracking-[0.15em] leading-tight m-0 break-words hyphens-auto"
          style={{
            textShadow:
              "0 0 20px rgba(100, 200, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          {title.toUpperCase()}
        </h2>

        <div
          className="w-[60px] h-[2px] mx-auto my-4"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.6), transparent)",
            boxShadow: "0 0 8px rgba(100, 200, 255, 0.4)",
          }}
        />

        <p
          className="font-['Montserrat',sans-serif] text-xs font-semibold text-[#eaf6ff]/70 tracking-[0.2em]"
          style={{
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          INFIN8 CULTURAL FEST
        </p>
      </div>

      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <span
          className="w-[30px] h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent)",
          }}
        />
        <span
          className="font-['Montserrat',sans-serif] text-[0.65rem] font-bold text-[#ffd700]/90 tracking-[0.15em]"
          style={{
            textShadow: "0 0 10px rgba(255, 215, 0, 0.4)",
          }}
        >
          COMING SOON
        </span>
        <span
          className="w-[30px] h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent)",
          }}
        />
      </div>

      <div className="absolute top-3 left-3 w-10 h-10 border-2 border-[rgba(100,200,255,0.2)] border-r-0 border-b-0 rounded-tl-lg z-[5]" />
      <div className="absolute top-3 right-3 w-10 h-10 border-2 border-[rgba(100,200,255,0.2)] border-l-0 border-b-0 rounded-tr-lg z-[5]" />
      <div className="absolute bottom-3 left-3 w-10 h-10 border-2 border-[rgba(100,200,255,0.2)] border-r-0 border-t-0 rounded-bl-lg z-[5]" />
      <div className="absolute bottom-3 right-3 w-10 h-10 border-2 border-[rgba(100,200,255,0.2)] border-l-0 border-t-0 rounded-br-lg z-[5]" />
    </div>
  );
}
