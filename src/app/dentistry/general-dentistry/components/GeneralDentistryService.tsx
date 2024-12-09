interface GeneralDentistryServiceProp {
  title: string;
  description: string;
  container_side: string;
}

export default function GeneralDentistryService({
  title,
  description,
  container_side,
}: GeneralDentistryServiceProp) {
  return (
    <div className="h-[79vh] flex gap-[177px] py-[97px] px-[165px]">
      {container_side === "left" ? (
        <>
          <div className="w-[37%] flex flex-col items-start justify-center gap-[67px]">
            <p className="text-[52px] leading-[59.02px] font-bold">{title}</p>
            <p className="text-[24px] leading-[27.27px] tracking-widest font-gillSans">
              {description}
            </p>
          </div>
          <div className="flex-1"></div>
        </>
      ) : (
        <>
          <div className="flex-1"></div>
          <div className="w-[37%] flex flex-col items-start justify-center gap-[67px]">
            <p className="text-[52px] leading-[59.02px] font-bold">{title}</p>
            <p className="text-[24px] leading-[27.27px] tracking-widest font-gillSans">
              {description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
