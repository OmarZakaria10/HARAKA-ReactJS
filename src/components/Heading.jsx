export default function Heading({ header, paragraph }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 mx-auto h-[15vh] bg-gradient-to-b from-slate-800 via-slate-900 to-gray-900">
      <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white text-center text-shadow">
        {header}
      </h1>
      <p className="text-base sm:text-lg lg:text-xl font-normal text-gray-400 text-center max-w-2xl mx-auto">
        {paragraph}
      </p>
    </div>
  );
}
