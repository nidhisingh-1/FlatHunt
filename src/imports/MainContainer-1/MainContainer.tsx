function TabPills() {
  return (
    <div className="bg-[rgba(255,255,255,0.2)] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.1)] flex-[1_0_0] max-w-[306px] min-w-px relative rounded-[9999px]" data-name="tabPills">
      <div className="flex flex-row items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center max-w-[inherit] pl-[4px] pr-[14px] py-[4px] relative size-full">
          <div className="bg-[#ededed] flex-[1_0_0] min-w-px mr-[-10px] relative rounded-[100px]" data-name="Tab1">
            <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[2px] items-center justify-center p-[8px] relative size-full">
                <div className="content-stretch flex flex-col items-start relative rounded-[90px] shrink-0 w-full" data-name="Symbol">
                  <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] mix-blend-plus-lighter opacity-90 relative shrink-0 text-[#007aff] text-[17px] text-center tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[22px]">{`\u{1004D4}`}</p>
                  </div>
                </div>
                <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[13px] overflow-hidden relative shrink-0 text-[11px] text-black text-center text-ellipsis tracking-[0.06px] w-full whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Label
                </p>
              </div>
            </div>
          </div>
          <div className="flex-[1_0_0] min-w-px mr-[-10px] relative" data-name="Tab2">
            <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[2px] items-center justify-center p-[8px] relative size-full">
                <div className="content-stretch flex flex-col items-start relative rounded-[90px] shrink-0 w-full" data-name="Symbol">
                  <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] mix-blend-plus-lighter opacity-50 relative shrink-0 text-[17px] text-black text-center tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[22px]">{`\u{1004D4}`}</p>
                  </div>
                </div>
                <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[13px] overflow-hidden relative shrink-0 text-[11px] text-black text-center text-ellipsis tracking-[0.06px] w-full whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Label
                </p>
              </div>
            </div>
          </div>
          <div className="flex-[1_0_0] min-w-px mr-[-10px] relative" data-name="Tab3">
            <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[2px] items-center justify-center p-[8px] relative size-full">
                <div className="content-stretch flex flex-col items-start relative rounded-[90px] shrink-0 w-full" data-name="Symbol">
                  <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] mix-blend-plus-lighter opacity-50 relative shrink-0 text-[17px] text-black text-center tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[22px]">{`\u{1004D4}`}</p>
                  </div>
                </div>
                <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[13px] overflow-hidden relative shrink-0 text-[11px] text-black text-center text-ellipsis tracking-[0.06px] w-full whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Label
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="h-full shrink-0 w-[16px]" data-name="Spacer" />;
}

function SearchContainer() {
  return (
    <div className="bg-gradient-to-b content-stretch drop-shadow-[0px_2px_10px_rgba(0,0,0,0.1)] flex from-[#3a77ff] items-center justify-end relative rounded-[9999px] shrink-0 to-[#1c1b1f]" data-name="searchContainer">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative rounded-[296px] shrink-0 size-[60px]" data-name="_tabItem">
        <div className="content-stretch flex flex-col items-start relative rounded-[90px] shrink-0 w-full" data-name="Symbol">
          <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] mix-blend-plus-lighter opacity-50 relative shrink-0 text-[17px] text-black text-center tracking-[-0.43px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[22px]">{`\u{1004D4}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainContainer() {
  return (
    <div className="content-stretch flex items-center justify-between px-[16px] relative size-full" data-name="mainContainer">
      <TabPills />
      <div className="flex flex-row items-center self-stretch">
        <Spacer />
      </div>
      <SearchContainer />
    </div>
  );
}