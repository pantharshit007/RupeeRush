function Title(props: { title: string }): React.JSX.Element {
  return (
    <div className="my-6">
      <p className="text-richPurple-600 text-4xl font-bold">{props.title}</p>
    </div>
  );
}

export default Title;
