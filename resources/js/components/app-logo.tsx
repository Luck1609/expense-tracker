import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
  return (
    <>

      <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <AppLogoIcon className="size-5 text-white" />
        </div>
        SpendWise
      </div>
    </>
  );
}
