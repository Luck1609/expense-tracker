import { router } from '@inertiajs/react'
import type { InertiaFormProps } from '@inertiajs/react'
import { FileText, Trash2, Video, FileType } from 'lucide-react'
import type { UseHttpPrecognitiveProps } from 'node_modules/@inertiajs/react/types/useHttp'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { useNotice } from '@/contexts/notice-context'
import useHelper from '@/hooks/use-helper'
import { cn, handleFormData } from '@/lib/utils'
import media from '@/routes/media'
import type { Icon, Media } from '@/types'

import { Button } from '../ui/button'
import { Label } from '../ui/label'


type IconStyles = {
  wrapper?: string;
  item?: string;
}

type PreviewStyles = {
  container?: string;
  card?: {
    wrapper?: string;
    icon?: IconStyles
    button?: {
      item?: string;
      icon?: string;
    }
    label?: {
      wrapper?: string;
      name?: string;
      size?: string;
    }
  }
}

type HeaderStyles = {
  wrapper?: string;
  title?: string;
  description?: string;
  img?: string;
}

interface FileUploaderProps<T extends object> {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  title?: string;
  description?: string;
  defaultComponent?: ReactNode
  label?: ReactNode;
  icon?: {
    item?: Icon;
    classNames?: IconStyles;
  }
  name: string;
  form: InertiaFormProps<T> | UseHttpPrecognitiveProps<T>
  classNames?: {
    wrapper?: string;
    // icon?: IconStyles
    header?: HeaderStyles;
    preview?: PreviewStyles
  }
}

const DEFAULT_MAX_SIZE = 1 * 1024 * 1024; // 1 MB
export const DEFAULT_ACCEPT = 'image/jpeg,image/webp,image/png,image/gif';

function validateFiles(files: File[], maxSize: number = DEFAULT_MAX_SIZE, accept: string = DEFAULT_ACCEPT): { valid: File[]; errorMessage: string | null } {
  const allowedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
  const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
  const valid: File[] = [];

  const extensions = (allowedTypes.map((t) => t.split('/').pop() || '')).map((ext) => `.${ext}`);

  for (const file of files) {
    if (file.size > maxSize) {
      return { valid: [], errorMessage: `"${file.name}" exceeds the maximum size of ${maxSizeMB}MB.` };
    }
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return { valid: [], errorMessage: `"${file.name}" has an unsupported file type. Allowed: ${extensions}` };
    }
    valid.push(file);
  }

  return { valid, errorMessage: null };
}

export default function FileUploader<T extends object>({
  maxFiles = 1,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
  title,
  description,
  classNames,
  form,
  label,
  ...props
}: FileUploaderProps<T>) {
  const { show } = useNotice();

  const { value, handleChange: handleFormChange, error: formError, validate, touch, touched, invalid } = handleFormData(props.name, form) || {}
  const error: string = formError;
  const hasError = invalid?.() && error

  const handleChange = (newFiles: unknown) => {
    handleFormChange?.(newFiles)
    touch?.()
  }

  useEffect(() => {
    if (touched?.() && validate) {
      validate()
    }
  // value is the only signal we care about — touched/validate are stable in behaviour
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const files = (value as (File | Media)[]) || []
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const { valid, errorMessage } = validateFiles(newFiles, maxSize, accept);

    if (errorMessage) {
      (form as any).setError(props.name, errorMessage);
      return;
    }

    if (typeof (form as any).clearErrors === 'function') {
      (form as any).clearErrors(props.name);
    }

    const currentFiles = Array.isArray(files) ? files : [];
    const remainingSlots = maxFiles - currentFiles.length;
    const filesToAdd = valid.slice(0, remainingSlots);

    const updatedFiles = maxFiles > 1 ? [...currentFiles, ...filesToAdd] : filesToAdd[0];
    handleChange?.(updatedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number, file: File | Media) => {
    const currentFiles = Array.isArray(files) ? files : [];
    const updatedFiles = currentFiles.filter((_, i: number) => i !== index);

    if (typeof file === 'object' && 'url' in file) {
      // This is a Media object from the server, show confirmation before deleting
      show({
        title: 'Delete File',
        type: 'notice',
        description: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        onConfirm: () => {
          router.delete(media.destroy({ id: file.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
              handleChange?.(updatedFiles);
            },
            onError: () => {
              console.error('Failed to delete media from server');
            },
          });
        },
      });
    } else {
      // This is a local File object, just update the state
      handleChange?.(updatedFiles);
    }
  };

  const data = {
    files,
    title,
    description,
    handleBrowseClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    maxFiles,
    isDragging,
    classNames,
    ...props
  }

  if (!form)
    throw new Error("File uploader requires inertia useForm hook")

  // console.log('Selected fiel details', files)

  return (
    <>
      {label && <Label>{label}</Label>}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        name={props.name}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {
        files?.length === 0 && <UploaderButton {...data} />
      }



      {
        (Array.isArray(files) && files.length > 0)
          ? (
            <div className={cn(" mt-6", maxFiles === 1 ? "" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5", classNames?.preview?.container)}>
              {
                files.map((file, index) => (
                  <FilePreviewCard
                    key={index}
                    file={file}
                    onRemove={() => handleRemoveFile(index, file)}
                    card={classNames?.preview?.card}
                  />
                ))

              }

              {
                files.length < maxFiles && <UploaderButton {...data} />
              }
            </div>
          )
          : (
            files instanceof File
              ? (
                <FilePreviewCard
                  file={files}
                  onRemove={() => handleRemoveFile(0, files)}
                  card={classNames?.preview?.card}
                />
              ) : null
          )
      }
      
      {/* Validation error display */}
      {hasError && (
        <small className={cn("text-red-500 text-sm mt-1", classNames?.wrapper)}>
          {error}
        </small>
      )}
    </>
  )
}


type UploadButtonProps<T extends object> = {
  handleBrowseClick: () => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: () => void
  handleDrop: (e: React.DragEvent) => void
  title?: string;
  description?: string;
  maxFiles: number;
  files: (File | Media)[];
  isDragging: boolean;

} & Pick<FileUploaderProps<T>, "classNames" | "icon" | "defaultComponent">

function UploaderButton<T extends object>({
  handleBrowseClick,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  title,
  description,
  maxFiles,
  files,
  isDragging,
  classNames,
  ...props
}: UploadButtonProps<T>) {
  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={cn(
          "rounded-xl p-4 flex flex-col justify-center border-2 border-dashed text-center space-y-4 transition-colors hover:bg-gray-100",
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300',
          classNames?.wrapper
        )}
      >
        {
          props?.icon && (
            <div className={cn("w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full text-primary", props?.icon?.classNames?.wrapper)}>
              {
                props.icon?.item && <props.icon.item className={cn("size-10", props.icon?.classNames?.item)} />
              }
            </div>
          )
        }

        <div className={cn("space-y-1 relative group", classNames?.header?.wrapper)}>
          {
            props?.defaultComponent 
              ? <>
                { props.defaultComponent }
              </>
              : (
                <>
                  <h2 className={cn("text-lg font-bold tracking-tight", classNames?.header?.title)}>{title ?? `Click or Drop file${maxFiles > 1 ? 's' : ''} here`}</h2>
                  {
                    description && (
                      <p className={cn("text-sm font-body text-accent-foreground", classNames?.header?.description)}>
                        {description}
                      </p>
                    )
                  }
                  {
                    maxFiles > 1 && (
                      <p className="text-xs text-gray-500">
                        {files.length} / {maxFiles} files selected
                      </p>)
                  }
                </>
              )
          }
        </div>
      </div>
    </>
  )
}


type FilePreviewCardProps = {
  file: File | Media;
  onRemove?: () => void;
  component?: ReactNode;
} & Pick<PreviewStyles, "card">

export const FilePreviewCard = ({ file, onRemove, card, component }: FilePreviewCardProps) => {
  const isMedia = 'url' in file;
  const fileName = isMedia ? file.name : file.name;
  const fileSize = isMedia ? file.size : formatFileSize(file.size);
  const { truncateByChar } = useHelper()

  return (
    <div className={cn("p-3 rounded-xl border flex items-center gap-4 group hover:border-gray-400 transition-colors", card?.wrapper)}>
      <div className={cn("w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center", card?.icon?.wrapper)}>
        {getFileIcon(file, card?.icon?.item)}
      </div>

      <div className={cn("flex-1 min-w-0", card?.label?.wrapper)}>
        <p className={cn("text-sm font-semibold truncate", card?.label?.name)} title={fileName}>
          {truncateByChar(fileName, 20)}
        </p>
        <span className={cn("flex gap-2 items-center text-accent-foreground text-xs", card?.label?.size)}>
          {fileSize}
        </span>
      </div>
      {
        component ? component
          : (
            <Button
              size="icon"
              variant="ghost"
              onClick={onRemove}
              className={cn("opacity-0 group-hover:opacity-100 transition-opacity", card?.button?.item)}
              type="button"
            >
              <Trash2 className={cn("h-4 w-4 text-red-500", card?.button?.icon)} />
            </Button>
          )
      }
    </div>
  );
};

function getFileIcon(file: Media | File, className?: string) {
  const isMedia = 'url' in file;
  const fileType = file?.type?.toLowerCase();


  // For Media type with URL, display image preview
  if (isMedia && file.url) {
    if (fileType.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className={cn("w-full h-full object-cover", className)}
        />
      );
    }
  }
  
  // For File type, create preview for images
  if (!isMedia && fileType?.startsWith('image/')) {
    const imageUrl = URL.createObjectURL(file);
    return (
      <img
        src={imageUrl}
        alt={file.name}
        className={cn("w-full h-full object-cover", className)}
        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
      />
    );
  }

  // PDF files
  if (fileType.includes('pdf') || fileType === 'application/pdf') {
    return <FileText className={cn("h-8 w-8 text-red-500", className)} />;
  }

  // Video files
  if (fileType.startsWith('video/')) {
    return <Video className={cn("h-8 w-8 text-purple-500", className)} />;
  }

  // Text files
  if (fileType.startsWith('text/') ||
    fileType.includes('document') ||
    fileType.includes('word') ||
    fileType.includes('msword')) {
    return <FileType className={cn("h-8 w-8 text-blue-500", className)} />;
  }

  // Default icon for unknown types
  return <FileText className={cn("h-8 w-8 text-gray-500", className)} />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}