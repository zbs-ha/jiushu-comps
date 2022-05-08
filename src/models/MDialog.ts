export interface MDialogCtx extends Record<string, any>{
  closeType?: 'cancel' | 'confirm'
}

type Form = Record<string, any>

export type MDialogRet = MDialogCtx & Form
