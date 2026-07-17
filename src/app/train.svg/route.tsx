import { NextResponse } from "next/server";
import { daysUntilEvent } from "@/src/util/date";

export async function GET() {
    const daysLeft = daysUntilEvent();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="1100" height="88" viewBox="0 0 291 23">
  <defs>
    <path id="a" d="M449.08 576.65h180.68v68.27H449.08z"/>
    <path id="b" d="M449.08 576.65h180.68v68.27H449.08z"/>
    <path id="c" d="M449.08 576.65h180.68v68.27H449.08z"/>
  </defs>
  <g transform="translate(21.93 -146.8)">
    <circle cx="253.59" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="260.39" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="227.69" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="234.21" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <rect width="3.17" height="14.58" x="215.63" y="150" ry=".97" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.895254;stroke-dasharray:none"/>
    <path d="M221.13 165.54s-.29 2.1.6 2.15l44.94.06s.97-.13.42-2.89c-.38-1.92-45.96.68-45.96.68z" style="display:inline;fill:#bebebe;fill-opacity:1;stroke:none;stroke-width:.625234;stroke-dasharray:none"/>
    <path d="M220.54 148.79s.66-1.9 2.8-2h41.54s1.08-.12 1.51 1.86c.43 1.98-45.85.14-45.85.14z" style="display:inline;fill:#dadada;fill-opacity:.976471;stroke:none;stroke-width:.71527;stroke-dasharray:none"/>
    <path d="M218.42 158s.01 3.97.1 6.11c.02.63-.1 1.57 1.24 1.7h48.48s.7-.03.7-.86l.09-6.94h-39.45l-5.72.01z" style="display:inline;fill:#da94b0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M59.43 158.03c.65 0 4.9-.05 5.46 0h45.15v-8.83c-.25-.6-.77-.54-.77-.54l-49.02-.05a.82.82 135.03 0 0-.82.83z" style="display:inline;fill:#f7d1e0;fill-opacity:1;stroke:none;stroke-width:.79375" transform="translate(159)"/>
  </g>
  <g transform="translate(21.93 -146.8)">
    <circle cx="200.69" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="207.41" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="174.67" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="181.19" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <rect width="3.17" height="14.58" x="162.6" y="150" ry=".97" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.895254;stroke-dasharray:none"/>
    <path d="M168.1 165.54s-.29 2.1.6 2.15l44.95.06s.96-.13.42-2.89c-.38-1.92-45.97.68-45.97.68z" style="display:inline;fill:#bebebe;fill-opacity:1;stroke:none;stroke-width:.625234;stroke-dasharray:none"/>
    <path d="M167.52 148.79s.65-1.9 2.8-2h41.53s1.08-.12 1.51 1.86c.43 1.98-45.84.14-45.84.14z" style="display:inline;fill:#dadada;fill-opacity:.976471;stroke:none;stroke-width:.71527;stroke-dasharray:none"/>
    <path d="M165.4 158s0 3.97.08 6.11c.03.63-.09 1.57 1.26 1.7h48.48s.7-.03.7-.86l.08-6.94-6.56.02-5.67-.05-27.22.04h-5.72z" style="display:inline;fill:#da94b0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M59.43 158.03h50.61v-8.83c-.25-.6-.77-.54-.77-.54l-49.02-.05a.82.82 135.03 0 0-.82.83z" style="display:inline;fill:#f7d1e0;fill-opacity:1;stroke:none;stroke-width:.79375" transform="translate(105.97)"/>
  </g>
  <g transform="translate(21.93 -146.8)">
    <circle cx="148.15" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="154.7" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="121.69" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="128.21" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <rect width="3.17" height="14.58" x="109.62" y="150" ry=".97" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.895254;stroke-dasharray:none"/>
    <path d="M115.12 165.54s-.29 2.1.6 2.15l44.95.06s.96-.13.41-2.89c-.37-1.92-45.96.68-45.96.68z" style="display:inline;fill:#bebebe;fill-opacity:1;stroke:none;stroke-width:.625234;stroke-dasharray:none"/>
    <path d="M114.53 148.79s.66-1.9 2.81-2h41.53s1.08-.12 1.51 1.86c.43 1.98-45.85.14-45.85.14z" style="display:inline;fill:#dadada;fill-opacity:.976471;stroke:none;stroke-width:.71527;stroke-dasharray:none"/>
    <path d="M112.41 158s.02 3.97.1 6.11c.02.63-.1 1.57 1.25 1.7h48.48s.7-.03.7-.86l.08-6.93h-6.56l-5.67.01h-32.94z" style="display:inline;fill:#da94b0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M59.43 158.03h50.61v-8.83c-.25-.6-.77-.54-.77-.54l-49.02-.05a.82.82 135.03 0 0-.82.83z" style="display:inline;fill:#f7d1e0;fill-opacity:1;stroke:none;stroke-width:.79375" transform="translate(52.99)"/>
  </g>
  <g transform="translate(21.93 -146.8)">
    <circle cx="68.7" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="75.22" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="94.14" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="100.75" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <rect width="3.17" height="14.58" x="56.64" y="150" ry=".97" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.895254;stroke-dasharray:none"/>
    <path d="M62.14 165.54s-.3 2.1.6 2.15l44.94.06s.96-.13.42-2.89c-.38-1.92-45.96.68-45.96.68z" style="display:inline;fill:#bebebe;fill-opacity:1;stroke:none;stroke-width:.625234;stroke-dasharray:none"/>
    <path d="M61.55 148.79s.66-1.9 2.8-2h41.54s1.08-.12 1.5 1.86c.44 1.98-45.84.14-45.84.14z" style="display:inline;fill:#dadada;fill-opacity:.976471;stroke:none;stroke-width:.71527;stroke-dasharray:none"/>
    <rect width="46.77" height="12.27" x="60.3" y="150.54" rx=".41" ry=".55" style="fill:#d5d5d5;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <path d="M59.45 157.86s.01 3.97.1 6.1c.02.64-.1 1.57 1.24 1.7h48.48s.7-.02.71-.85l.06-6.88h-6.54l-.04 4.2s-.14.49-.61.49h-4.33s-.68.06-.68-.68v-4.15H70.6v4.23s.01.63-.44.77h-4.84s-.35.02-.48-.48l.04-4.4z" style="display:inline;fill:#da94b0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M59.43 158.03c.65 0 4.9-.05 5.46 0v-5.42c0-.26.23-.28.23-.28h5.19c.3 0 .3.3.3.3v5.4h27.22s.01-5.03.1-5.29c.08-.25.34-.24.34-.24h4.85c.34 0 .37.37.37.37v5.16h6.55v-8.83c-.25-.6-.77-.54-.77-.54l-49.02-.05a.82.82 135.03 0 0-.82.83z" style="display:inline;fill:#f7d1e0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <rect width="4.77" height="3.18" x="76.68" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="82.09" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="87.75" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.41" height="8.24" x="65.57" y="153.34" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.41" height="8.24" x="98.5" y="153.34" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
  </g>
  <g transform="translate(21.93 -146.8)">
    <circle cx="47.74" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="41.36" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="-5.69" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <circle cx="-12.09" cy="167.97" r="2.01" style="fill:#505050;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <path d="M-18.67 165.54s-.47 2.1.97 2.15l72.48.06s1.55-.13.67-2.89c-.61-1.92-74.12.68-74.12.68z" style="display:inline;fill:#bebebe;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <path d="M-1.85 148.79s.81-1.9 3.46-2h51.18s1.33-.12 1.86 1.86-56.5.14-56.5.14z" style="display:inline;fill:#dadada;fill-opacity:.976471;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <rect width="46.77" height="12.27" x="6.26" y="150.54" rx=".41" ry=".55" style="fill:#d5d5d5;fill-opacity:1;stroke:none;stroke-width:.793999;stroke-dasharray:none"/>
    <path d="M-20.48 158.03s-1.45 1.31-1.45 3.34a4.28 4.28 0 0 0 3.23 4.29h74.94s.7-.02.7-.85l.02-6.88h-4.17l-.04 4.2s-.13.49-.6.49h-4.56s-.68.06-.68-.68l-.01-4.15H14.7l-.03 4.23s0 .63-.45.77H9.3s-.35.02-.48-.48l.04-4.4z" style="display:inline;fill:#da94b0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M-20.5 158.03s7.34-7.3 17.07-9.37h59.61s.53-.07.77.54v8.83H52.8v-5.16s-.03-.37-.37-.37h-5.09s-.26-.01-.34.24c-.08.26-.09 5.29-.09 5.29H14.7v-5.4s0-.3-.3-.3H9.08s-.22.02-.22.28v5.42h-28.13z" style="display:inline;fill:#f7d1e0;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <path d="M-4.03 148.8s-6.22.88-13.33 6.57c0 0-.22.16 0 .16H-4.3s.3 0 .3-.31l.03-6.32s.02-.14-.06-.1z" style="display:inline;fill:#404040;fill-opacity:1;stroke:none;stroke-width:.79375"/>
    <rect width="4.77" height="3.18" x=".73" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="17.67" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.41" height="8.24" x="9.59" y="153.34" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.41" height="8.24" x="47.65" y="153.34" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="23.36" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="28.78" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="34.43" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
    <rect width="4.77" height="3.18" x="39.98" y="151.33" ry=".55" style="fill:#404040;fill-opacity:1;stroke:none;stroke-width:.794;stroke-dasharray:none"/>
  </g>
  <text xml:space="preserve" style="font-weight:250;font-size:53.3333px;font-family:Roboto;-inkscape-font-specification:&quot;Roboto weight=250&quot;;writing-mode:lr-tb;direction:ltr;white-space:pre;shape-inside:url(#a);shape-padding:.194779;display:inline;fill:#505050;fill-opacity:1;stroke:none;stroke-width:3.00094;stroke-dasharray:none" transform="translate(31.75 -149.97) scale(.26458)"><tspan x="449.28" y="625.88"><tspan style="font-weight:700;-inkscape-font-specification:&quot;Roboto Bold&quot;">${daysLeft}</tspan></tspan></text>
  <text xml:space="preserve" style="font-weight:250;font-size:53.3333px;font-family:Roboto;-inkscape-font-specification:&quot;Roboto weight=250&quot;;writing-mode:lr-tb;direction:ltr;white-space:pre;shape-inside:url(#b);shape-padding:.194779;display:inline;fill:#505050;fill-opacity:1;stroke:none;stroke-width:3.00094;stroke-dasharray:none" transform="translate(77.83 -151.14) scale(.26458)"><tspan x="449.28" y="625.88"><tspan style="font-weight:700;-inkscape-font-specification:&quot;Roboto Bold&quot;">${daysLeft === 1 ? "Day" : "Days"}</tspan></tspan></text>
  <text xml:space="preserve" style="font-weight:250;font-size:53.3333px;font-family:Roboto;-inkscape-font-specification:&quot;Roboto weight=250&quot;;writing-mode:lr-tb;direction:ltr;white-space:pre;shape-inside:url(#c);shape-padding:.194779;display:inline;fill:#505050;fill-opacity:1;stroke:none;stroke-width:3.00094;stroke-dasharray:none" transform="translate(133.45 -151.14) scale(.26458)"><tspan x="449.28" y="625.88"><tspan style="font-weight:700;-inkscape-font-specification:&quot;Roboto Bold&quot;">Left</tspan></tspan></text>
</svg>`;

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=3600, must-revalidate",
        },
    });
}
