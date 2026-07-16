import { useRef, type ChangeEvent, type ReactNode } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';
import { Button } from '../Button';
import { Progress } from '../Progress';

export interface UploadFile {
  key: string;
  name: string;
  size?: number;
  /** Driven by the consumer — the component never talks to the network. */
  status?: 'ready' | 'uploading' | 'done' | 'error';
  /** Progress percent while `status` is 'uploading'. */
  percent?: number;
}

export interface UploadProps {
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  /** The native File rides along in `meta` so the consumer can upload it. */
  onChange?: (list: UploadFile[], meta: { file: File | null; type: 'add' | 'remove' }) => void;
  accept?: string;
  multiple?: boolean;
  /** Picks beyond this count are ignored. */
  maxCount?: number;
  disabled?: boolean;
  /** Trigger content; defaults to a localized button label. */
  children?: ReactNode;
  'aria-label'?: string;
}

const COPY = {
  'zh-CN': { pick: '选择文件', remove: '移除文件' },
  'en-US': { pick: 'Choose file', remove: 'Remove file' },
} as const;

let nextFileKey = 0;

function formatSize(bytes?: number): string | null {
  if (bytes === undefined) {
    return null;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Upload({
  fileList,
  defaultFileList,
  onChange,
  accept,
  multiple = false,
  maxCount,
  disabled = false,
  children,
  'aria-label': ariaLabel,
}: UploadProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const inputRef = useRef<HTMLInputElement | null>(null);
  // onChange carries a meta argument, so the list state notifies manually
  // instead of through useControllableState's single-argument onChange.
  const [list, setList] = useControllableState<UploadFile[]>({
    value: fileList,
    defaultValue: defaultFileList ?? [],
  });

  const commit = (next: UploadFile[], meta: { file: File | null; type: 'add' | 'remove' }) => {
    setList(next);
    onChange?.(next, meta);
  };

  const handlePick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    // Allow re-picking the same file later.
    event.target.value = '';
    let next = list;
    for (const file of picked) {
      if (maxCount !== undefined && next.length >= maxCount) {
        break;
      }
      nextFileKey += 1;
      const entry: UploadFile = {
        key: `lg-upload-${nextFileKey}`,
        name: file.name,
        size: file.size,
        status: 'ready',
      };
      next = [...next, entry];
      commit(next, { file, type: 'add' });
    }
  };

  const remove = (key: string) => {
    commit(
      list.filter((item) => item.key !== key),
      { file: null, type: 'remove' },
    );
  };

  return (
    <div className="lg-upload" data-disabled={disabled ? '' : undefined}>
      <input
        ref={inputRef}
        data-testid="lg-upload-input"
        type="file"
        className="lg-upload__input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        onChange={handlePick}
      />
      <Button
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.click()}
      >
        {children ?? copy.pick}
      </Button>
      {list.length > 0 ? (
        <ul className="lg-upload__list">
          {list.map((item) => (
            <li key={item.key} className="lg-upload__item" data-status={item.status ?? 'ready'}>
              <span className="lg-upload__name">{item.name}</span>
              {formatSize(item.size) ? (
                <span className="lg-upload__size">{formatSize(item.size)}</span>
              ) : null}
              {item.status === 'uploading' ? (
                <span className="lg-upload__progress">
                  <Progress value={item.percent ?? 0} size="sm" aria-label={item.name} />
                </span>
              ) : null}
              <button
                type="button"
                className="lg-upload__remove"
                aria-label={copy.remove}
                disabled={disabled}
                onClick={() => remove(item.key)}
              >
                <span aria-hidden="true">{'×'}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
