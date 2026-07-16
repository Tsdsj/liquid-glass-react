import { Modal as ModalBase } from './Modal';
import { confirm } from './confirm';

/** Modal with its imperative static: `Modal.confirm(options): Promise<boolean>`. */
export const Modal = /* @__PURE__ */ Object.assign(ModalBase, { confirm });
export type { ModalProps } from './Modal';
export type { ConfirmOptions } from './confirm';
