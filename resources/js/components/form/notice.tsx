import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Loader from "../loader";


type Props = {
  title?: string;
  description?: string;
  open: boolean;
  toggler: () => void;
  isLoading: boolean;
  classNames?: {
    container?: string;
    title?: string;
    description?: string;
    footer?: {
      container?: string;
      cancelButton?: string;
      continueButton?: string;
    };
  }
} & ({
  type: 'notice';
  action: () => void;
} | {
  type: 'alert'
})

export function Notice({ title, description, open, toggler, type, classNames, ...props }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={toggler}>
      <AlertDialogContent className={classNames?.container}>
        {
          title && (
            <AlertDialogHeader>
              <AlertDialogTitle className={classNames?.title}>{title}</AlertDialogTitle>
              {
                description && (
                  <AlertDialogDescription className={classNames?.description}>
                    {description}
                  </AlertDialogDescription>
                )
              }
            </AlertDialogHeader>
          )
        }
        <AlertDialogFooter className={classNames?.footer?.container}>
          <AlertDialogCancel variant="destructive" className={classNames?.footer?.cancelButton} onClick={toggler}>Close</AlertDialogCancel>
          {
            type === 'notice' && (
              <AlertDialogAction 
              className={classNames?.footer?.continueButton} 
              onClick={(props as { action: () => void }).action}
              disabled={props.isLoading}
              >
                {props.isLoading && <Loader />}
                {props.isLoading ? 'Submitting...' : 'Continue'}
              </AlertDialogAction>
            )
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
