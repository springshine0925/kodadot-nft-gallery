import { TransactionStatus } from './useTransactionStatus'

type Params = {
  transaction: {
    status: Ref<TransactionStatus>
    isError: Ref<boolean>
  }
  onSuccess: () => any
  onCancel?: () => void
  onError?: () => void
  successStatus?: TransactionStatus
  waitFor?: Array<Ref>
}

export default ({
  transaction: { status, isError },
  onSuccess,
  onError,
  onCancel,
  successStatus = TransactionStatus.Block,
  waitFor = [],
}: Params) => {
  watch([status, ...waitFor], ([curStatus]) => {
    if (curStatus === TransactionStatus.Cancelled) {
      return onCancel?.()
    }

    if (curStatus === TransactionStatus.Block && isError.value) {
      return onError?.()
    }

    if (curStatus === successStatus && waitFor.every((i) => Boolean(i.value))) {
      onSuccess()
    }
  })
}
