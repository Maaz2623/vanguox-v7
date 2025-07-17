interface Props {
  location: string;
  temperature: number;
}

export const Temperature = ({ location, temperature }: Props) => {
  return (
    <div className="bg-card">
      Location: {location}
      Temperature: {temperature}
    </div>
  );
};
