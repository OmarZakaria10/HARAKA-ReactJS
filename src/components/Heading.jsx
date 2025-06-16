export default function Heading({ header, paragraph }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[14vh] lg:py-0">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        {header}
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        {paragraph}
      </p>
    </div>
    
  );
}
