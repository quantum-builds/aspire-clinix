interface PageHeadingProps {
  text: string;
}

export default function PageHeading({ text }: PageHeadingProps) {
  return <h1 className="font-medium text-[25px]">{text}</h1>;
}
