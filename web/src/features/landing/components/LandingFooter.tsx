const CURRENT_YEAR = new Date().getFullYear();

export const LandingFooter = () => {
  return (
    <footer className="text-muted-foreground relative bg-white py-3 text-sm shadow-sm dark:bg-slate-800">
      <div className="absolute bottom-2 right-2">
        <p className="text-xs tracking-tight">Version: {__APP_VERSION__}</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="mb-1 flex flex-row flex-wrap font-medium lg:flex-nowrap">
          <div className="flex w-1/2 items-center justify-center lg:w-auto">
            <a
              className="underline-offset-3 p-1 text-center hover:underline lg:mx-2"
              href={'https://douglasneuroinformatics.ca'}
              rel="noreferrer"
              target="_blank"
            >
              Douglas Neuroinformatics
            </a>
          </div>
          <div className="flex w-1/2 items-center justify-center lg:w-auto">
            <a
              className="underline-offset-3 p-1 text-center hover:underline lg:mx-2"
              href={'https://github.com/DouglasNeuroInformatics/DataBank'}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <p className="text-center">&copy; {CURRENT_YEAR} Douglas Neuroinformatics Platform</p>
    </footer>
  );
};
