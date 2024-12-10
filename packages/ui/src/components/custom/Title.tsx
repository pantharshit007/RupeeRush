function Title(props: { title: string }): React.JSX.Element {
  return (
    <div className="mt-6">
      <p className="text-azureBlue-500 text-4xl max-md:text-3xl max-sm:text-2xl font-bold">
        {props.title}
      </p>
    </div>
  );
}

export default Title;
